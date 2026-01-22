from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI")
CLIENT = AsyncIOMotorClient(MONGODB_URI)
DB = CLIENT.assist_ai

teacher_collection = DB.teachers
admin_collection = DB.admins
notes_collection = DB.notes
tasks_collection = DB.tasks
subjects_collection = DB.subjects
reminders_collection = DB.reminders
feedback_collection = DB.feedback

async def get_database():
    return DB
