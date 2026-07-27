from pydantic import BaseModel, Field
from typing import List, Optional

# Requests
class TaskGenerationRequest(BaseModel):
    user_id: str
    confidence_score: float = Field(..., ge=0.0, le=1.0)
    theme: str
    recent_topics: List[str]

class TaskEvaluationRequest(BaseModel):
    task_id: str
    scenario: str
    answer: str

# Responses
class TaskGenerationResponse(BaseModel):
    task_id: str
    topic: str
    difficulty_label: str
    time_limit_seconds: int
    scenario: str
    hints: List[str]

class TaskEvaluationResponse(BaseModel):
    is_correct: bool
    feedback: str
    score_delta: int
