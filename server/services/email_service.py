import os
import secrets
import hashlib
import sqlite3
import logging
from datetime import datetime, timedelta
from typing import Optional, Tuple
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import smtplib

logger = logging.getLogger("ascend_email_service")
logger.setLevel(logging.INFO)

DB_PATH = os.getenv("DATABASE_PATH", r"d:\real ascend os\server\prisma\dev.db")

SMTP_HOST = os.getenv("SMTP_HOST", "")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER", "")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")
SMTP_FROM_EMAIL = os.getenv("SMTP_FROM_EMAIL", "system@ascend-os.neural")
SMTP_FROM_NAME = os.getenv("SMTP_FROM_NAME", "Ascend OS Neural Gateway")

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def generate_otp() -> str:
    """Generate a secure 6-digit numeric OTP."""
    return f"{secrets.randbelow(900000) + 100000:06d}"

def hash_otp(otp: str) -> str:
    salt = secrets.token_hex(8)
    h = hashlib.sha256(f"{otp}:{salt}".encode("utf-8")).hexdigest()
    return f"{salt}:{h}"

def verify_otp_hash(otp: str, stored_hash: str) -> bool:
    if not stored_hash or ":" not in stored_hash:
        return False
    try:
        salt, expected_h = stored_hash.split(":", 1)
        calc_h = hashlib.sha256(f"{otp}:{salt}".encode("utf-8")).hexdigest()
        return secrets.compare_digest(calc_h, expected_h)
    except Exception:
        return False

def can_request_otp(email: str) -> Tuple[bool, str]:
    """Check if the email has exceeded rate limits (max 3 requests in 15 minutes)."""
    email_clean = email.strip().lower()
    window_start = (datetime.utcnow() - timedelta(minutes=15)).strftime("%Y-%m-%d %H:%M:%S")
    
    conn = get_db_connection()
    c = conn.cursor()
    try:
        c.execute(
            "SELECT COUNT(*) as count FROM EmailVerificationToken WHERE LOWER(email) = ? AND createdAt >= ?",
            (email_clean, window_start)
        )
        row = c.fetchone()
        count = row["count"] if row else 0
        if count >= 3:
            return False, "Rate limit exceeded. Maximum 3 verification codes per 15 minutes. Please try again later."
        return True, ""
    finally:
        conn.close()

def create_and_store_otp(email: str, user_id: Optional[str] = None) -> Tuple[str, str]:
    """Create a new 6-digit OTP and store its hash in the database."""
    email_clean = email.strip().lower()
    otp = generate_otp()
    otp_h = hash_otp(otp)
    token_id = f"evt-{secrets.token_hex(10)}"
    expires_at = (datetime.utcnow() + timedelta(minutes=5)).strftime("%Y-%m-%d %H:%M:%S")
    now_str = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")

    conn = get_db_connection()
    c = conn.cursor()
    try:
        # Invalidate existing pending tokens for this email
        c.execute("DELETE FROM EmailVerificationToken WHERE LOWER(email) = ?", (email_clean,))
        c.execute(
            """
            INSERT INTO EmailVerificationToken (id, userId, email, otpHash, expiresAt, attempts, createdAt)
            VALUES (?, ?, ?, ?, ?, 0, ?)
            """,
            (token_id, user_id, email_clean, otp_h, expires_at, now_str)
        )
        conn.commit()
    finally:
        conn.close()

    return token_id, otp

def validate_otp_code(email: str, otp: str, user_id: Optional[str] = None) -> Tuple[bool, str]:
    """Validate submitted 6-digit OTP code against the latest valid record."""
    email_clean = email.strip().lower()
    otp_clean = otp.strip()
    now_str = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")

    conn = get_db_connection()
    c = conn.cursor()
    try:
        c.execute(
            """
            SELECT id, otpHash, expiresAt, attempts, userId 
            FROM EmailVerificationToken 
            WHERE LOWER(email) = ? 
            ORDER BY createdAt DESC 
            LIMIT 1
            """,
            (email_clean,)
        )
        row = c.fetchone()
        if not row:
            return False, "No active verification code found for this email. Please request a new code."

        token_id = row["id"]
        stored_hash = row["otpHash"]
        expires_at = row["expiresAt"]
        attempts = row["attempts"]

        if attempts >= 5:
            c.execute("DELETE FROM EmailVerificationToken WHERE id = ?", (token_id,))
            conn.commit()
            return False, "Too many failed verification attempts. Please request a new verification code."

        # Check expiration
        if str(expires_at) < now_str:
            c.execute("DELETE FROM EmailVerificationToken WHERE id = ?", (token_id,))
            conn.commit()
            return False, "Verification code has expired. Please request a new 5-minute code."

        # Verify OTP Hash
        if not verify_otp_hash(otp_clean, stored_hash):
            c.execute("UPDATE EmailVerificationToken SET attempts = attempts + 1 WHERE id = ?", (token_id,))
            conn.commit()
            remaining = 5 - (attempts + 1)
            return False, f"Incorrect verification code. {remaining} attempts remaining."

        # Success - clean up used token
        c.execute("DELETE FROM EmailVerificationToken WHERE id = ?", (token_id,))
        conn.commit()
        return True, "Verification successful."
    finally:
        conn.close()

def send_verification_email(email: str, otp: str, context: str = "Account Verification") -> bool:
    """Send cyberpunk-themed HTML email with 6-digit OTP code."""
    subject = f"[{context.upper()}] Ascend OS Neural Verification Code: {otp}"
    
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Ascend OS Neural Verification</title>
      <style>
        body {{
          background-color: #050a18;
          color: #e2e8f0;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          margin: 0;
          padding: 30px 15px;
        }}
        .container {{
          max-width: 540px;
          margin: 0 auto;
          background: #0a1128;
          border: 1px solid rgba(6, 182, 212, 0.3);
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.6);
        }}
        .header {{
          background: linear-gradient(135deg, #0f172a, #0369a1);
          padding: 24px;
          text-align: center;
          border-bottom: 2px solid #06b6d4;
        }}
        .logo-title {{
          font-size: 24px;
          font-weight: 900;
          letter-spacing: 3px;
          color: #ffffff;
          margin: 0;
          text-shadow: 0 0 10px rgba(6, 182, 212, 0.8);
        }}
        .subtitle {{
          font-size: 11px;
          color: #38bdf8;
          text-transform: uppercase;
          letter-spacing: 2px;
          margin-top: 5px;
        }}
        .content {{
          padding: 32px 24px;
          text-align: center;
        }}
        .instruction {{
          font-size: 14px;
          color: #94a3b8;
          line-height: 1.6;
          margin-bottom: 24px;
        }}
        .otp-box {{
          display: inline-block;
          background: rgba(6, 182, 212, 0.08);
          border: 2px dashed #06b6d4;
          border-radius: 14px;
          padding: 16px 36px;
          margin: 10px 0 24px 0;
        }}
        .otp-code {{
          font-family: 'Courier New', Courier, monospace;
          font-size: 38px;
          font-weight: 900;
          letter-spacing: 10px;
          color: #22d3ee;
          text-shadow: 0 0 15px rgba(6, 182, 212, 0.7);
        }}
        .expiry-notice {{
          font-size: 12px;
          color: #f59e0b;
          font-weight: 600;
          margin-bottom: 20px;
        }}
        .footer {{
          background: #030712;
          padding: 16px;
          text-align: center;
          font-size: 10px;
          color: #475569;
          font-family: monospace;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }}
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 class="logo-title">ASCEND OS</h1>
          <div class="subtitle">Neural Identity Gateway · v2.0</div>
        </div>
        <div class="content">
          <p class="instruction">
            An authentication or email verification request was initiated for your Ascend OS account. Enter the 6-digit neural cipher below to complete verification:
          </p>
          <div class="otp-box">
            <div class="otp-code">{otp}</div>
          </div>
          <p class="expiry-notice">
            ⏱️ This cipher is valid for 5 minutes. Do not share this code with anyone.
          </p>
          <p style="font-size: 11px; color: #64748b;">
            If you did not initiate this request, you can safely disregard this transmission.
          </p>
        </div>
        <div class="footer">
          ASCEND OS // QUANTUM ENCRYPTION ACTIVE // SYSTEM ID: {secrets.token_hex(4).upper()}
        </div>
      </div>
    </body>
    </html>
    """

    # Always log OTP in server console for local testing and developer visibility
    print(f"\n========================================================")
    print(f"🔥 [ASCEND OS EMAIL OTP DISPATCH]")
    print(f"   Recipient: {email}")
    print(f"   Context:   {context}")
    print(f"   OTP Code:  {otp}")
    print(f"   Expires:   5 Minutes")
    print(f"========================================================\n")

    # If SMTP is configured, attempt SMTP transmission
    if SMTP_HOST and SMTP_USER and SMTP_PASSWORD:
        try:
            msg = MIMEMultipart("alternative")
            msg["Subject"] = subject
            msg["From"] = f"{SMTP_FROM_NAME} <{SMTP_FROM_EMAIL}>"
            msg["To"] = email

            part_text = MIMEText(f"Your Ascend OS verification code is: {otp} (Valid for 5 minutes).", "plain")
            part_html = MIMEText(html_content, "html")
            msg.attach(part_text)
            msg.attach(part_html)

            with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
                server.starttls()
                server.login(SMTP_USER, SMTP_PASSWORD)
                server.sendmail(SMTP_FROM_EMAIL, [email], msg.as_string())
            logger.info(f"Email OTP successfully dispatched via SMTP to {email}")
            return True
        except Exception as e:
            logger.error(f"Failed to send email via SMTP: {e}")
            return True # Fallback logged to console, do not fail operation in dev
    
    return True
