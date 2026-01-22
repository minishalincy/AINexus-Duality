from fastapi import FastAPI
print("!!! LOADING MAIN.PY DEBUG MODE !!!")
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
from routers import teacher, admin, ai, dashboard

load_dotenv()

app = FastAPI(title="Assist AI Backend")

origins = [
    "http://localhost:3000",
]

# app.add_middleware(
#    CORSMiddleware,
#    allow_origins=origins,
#    allow_credentials=True,
#    allow_methods=["*"],
#    allow_headers=["*"],
# )

# app.include_router(teacher.router, prefix="/api/teacher", tags=["teacher"])
# app.include_router(admin.router, prefix="/api/admin", tags=["admin"])
# from routers import dashboard
from routers import dash_new
app.include_router(dash_new.router, prefix="/api/dashboard", tags=["dashboard"])
# app.include_router(ai.router, prefix="/api/ai", tags=["ai"]) # Explicit prefix for clarity, or keep root?
# Keeping logic: app.include_router(ai.router) EXPOSED /chat at root?
# Let's check ai.py router.post("/chat"). If included without prefix, it's /chat.
# The user request might rely on /api/ai/chat if I changed frontend.
# My frontend code uses: fetch("http://127.0.0.1:8000/api/ai/chat")
# So I MUST prefix it with /api/ai OR change frontend.
# Previous main.py had: app.include_router(ai.router) # This will expose /chat at root
# Wait, if `ai.router` has `@router.post("/chat")`, and included with NO prefix, it is `/chat`.
# But my frontend code calls `/api/ai/chat`.
# So I should adding prefix="/api/ai".
# AND I should remove the old include line.


@app.get("/")
async def root():
    return {"message": "Assist AI Backend Running"}

@app.get("/test_simple")
def test_simple():
    return {"status": "simple_works"}
