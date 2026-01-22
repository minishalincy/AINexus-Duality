from fastapi import APIRouter

router = APIRouter()

@router.get("/subjects_test")
def get_subjects_test():
    return {"status": "minimal_dashboard_active"}
