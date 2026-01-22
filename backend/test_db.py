import asyncio
import os
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient

load_dotenv()

async def test():
    uri = os.getenv("MONGODB_URI")
    print(f"URI: {uri}")
    if not uri:
        print("MONGODB_URI is missing")
        return

    client = AsyncIOMotorClient(uri)
    try:
        # The ismaster command is cheap and does not require auth.
        await client.admin.command('ismaster')
        print("MongoDB connection successful")
    except Exception as e:
        print(f"MongoDB connection failed: {e}")

if __name__ == "__main__":
    asyncio.run(test())
