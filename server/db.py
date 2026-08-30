import asyncio
from prisma import Prisma

db = Prisma(auto_register=True)

async def ensure_db_connected():
    """
    Checks if the Prisma client is connected to PostgreSQL.
    Re-establishes connection if it was dropped or closed due to serverless scale-to-zero.
    """
    try:
        if not db.is_connected():
            await db.connect()
            return
        
        # Test query to verify active socket
        await db.query_raw("SELECT 1")
    except Exception as e:
        err_str = str(e)
        if "Closed" in err_str or "connection" in err_str.lower() or "quaint" in err_str.lower() or not db.is_connected():
            print(f"[Prisma Connection Warning] Neon connection closed or stale ({e}). Reconnecting...")
            try:
                if db.is_connected():
                    await db.disconnect()
            except Exception:
                pass
            try:
                await db.connect()
                print("[Prisma Connection Success] Successfully reconnected to Neon PostgreSQL.")
            except Exception as reconnect_err:
                print(f"[Prisma Reconnect Error] Failed to reconnect: {reconnect_err}")

async def execute_with_retry(query_coroutine_fn, max_retries: int = 2):
    """
    Executes a Prisma database query coroutine, catching Closed/Connection errors and retrying once after reconnecting.
    """
    for attempt in range(max_retries + 1):
        try:
            await ensure_db_connected()
            return await query_coroutine_fn()
        except Exception as e:
            err_str = str(e)
            if ("Closed" in err_str or "connection" in err_str.lower() or "quaint" in err_str.lower()) and attempt < max_retries:
                print(f"[Prisma Retry Warning] Query failed on attempt {attempt + 1}: {e}. Retrying after reconnect...")
                try:
                    if db.is_connected():
                        await db.disconnect()
                    await db.connect()
                except Exception:
                    pass
                await asyncio.sleep(0.2)
                continue
            raise e
