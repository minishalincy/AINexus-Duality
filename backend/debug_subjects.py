import asyncio
import os
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient

load_dotenv()

async def debug():
    uri = os.getenv("MONGODB_URI")
    client = AsyncIOMotorClient(uri)
    db = client.assist_ai
    subjects_collection = db.subjects

    print("Fetching subjects...")
    cursor = subjects_collection.find()
    subs = await cursor.to_list(length=10)
    print(f"Found {len(subs)} subjects.")
    
    for sub in subs:
        print("-" * 20)
        print(f"Full Doc: {sub}")
        for k, v in sub.items():
            print(f"{k}: {type(v)}")

if __name__ == "__main__":
    asyncio.run(debug())
