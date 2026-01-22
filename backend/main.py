
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
from routers import teacher, admin, ai, dashboard, calendar, feedback

load_dotenv()

app = FastAPI(title="Assist AI Backend")

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(teacher.router, prefix="/api/teacher", tags=["teacher"])
app.include_router(admin.router, prefix="/api/admin", tags=["admin"])
app.include_router(dashboard.router, prefix="/api/dashboard", tags=["dashboard"])
app.include_router(calendar.router, prefix="/api/calendar", tags=["calendar"])
app.include_router(feedback.router, prefix="/api/feedback", tags=["feedback"])
app.include_router(ai.router, prefix="/api/ai", tags=["ai"])

@app.get("/")
async def root():
    return {"message": "Assist AI Backend Running -- RELOAD CONFIRMED"}
