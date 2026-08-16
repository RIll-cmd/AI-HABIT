import sys
import os

# Ensure root and server directories are in python path for serverless imports
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SERVER_DIR = os.path.join(BASE_DIR, "server")

if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)
if SERVER_DIR not in sys.path:
    sys.path.insert(0, SERVER_DIR)

# Import the configured FastAPI application instance
try:
    from server.main import app
except ImportError:
    from main import app

# Expose app for Vercel Python runtime
__all__ = ["app"]
