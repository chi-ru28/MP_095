from fastapi import APIRouter, HTTPException
from models.schemas import TaskGenerationRequest, TaskGenerationResponse, TaskEvaluationRequest, TaskEvaluationResponse
from graphs.generation_graph import generation_graph
from graphs.evaluation_graph import evaluation_graph

router = APIRouter(prefix="/tasks", tags=["Tasks"])

@router.post("/generate", response_model=TaskGenerationResponse)
async def generate_task(request: TaskGenerationRequest):
    initial_state = {"request": request.model_dump()}
    
    try:
        # Run LangGraph pipeline
        result = generation_graph.invoke(initial_state)
        
        if "error" in result and result["error"]:
            raise HTTPException(status_code=500, detail=result["error"])
            
        return result["final_response"]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/evaluate", response_model=TaskEvaluationResponse)
async def evaluate_task(request: TaskEvaluationRequest):
    initial_state = {"request": request.model_dump()}
    
    try:
        # Run LangGraph pipeline
        result = evaluation_graph.invoke(initial_state)
        
        if "error" in result and result["error"]:
            raise HTTPException(status_code=500, detail=result["error"])
            
        return result["final_response"]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
