from typing import Dict, Any, TypedDict
from langchain_google_genai import ChatGoogleGenerativeAI
from langgraph.graph import StateGraph, END

from config.settings import settings
from models.schemas import TaskEvaluationRequest, TaskEvaluationResponse

class EvaluationState(TypedDict):
    request: Dict[str, Any]
    llm_output: str
    final_response: Dict[str, Any]
    error: str

def eval_prompt_node(state: EvaluationState) -> EvaluationState:
    req = TaskEvaluationRequest(**state["request"])
    
    prompt = f"""
    You are an AI Game Master evaluating a player's answer.
    Scenario given to player: {req.scenario}
    Player's answer: {req.answer}
    
    Evaluate if the answer is logically correct or sufficiently close.
    Return strictly valid JSON matching this schema:
    {{
        "is_correct": boolean,
        "feedback": "String. 1-2 sentences of narrative feedback.",
        "score_delta": Int (positive if correct, 0 if incorrect)
    }}
    """
    state["request"]["_prompt"] = prompt
    return state

def eval_llm_node(state: EvaluationState) -> EvaluationState:
    try:
        if not settings.gemini_api_key:
            # Fallback for dev without API key
            state["llm_output"] = '{"is_correct": true, "feedback": "Mock correct feedback.", "score_delta": 50}'
            return state

        llm = ChatGoogleGenerativeAI(
            model="gemini-1.5-flash",
            google_api_key=settings.gemini_api_key,
            temperature=0.2 # low temp for evaluation
        )
        response = llm.invoke(state["request"]["_prompt"])
        state["llm_output"] = response.content
    except Exception as e:
        state["error"] = str(e)
    return state

def eval_parse_node(state: EvaluationState) -> EvaluationState:
    import json
    if "error" in state and state["error"]:
        return state
        
    try:
        clean_json = state["llm_output"].strip().strip('```json').strip('```').strip()
        data = json.loads(clean_json)
        
        validated = TaskEvaluationResponse(**data)
        state["final_response"] = validated.model_dump()
    except Exception as e:
        state["error"] = f"Evaluation Parsing failed: {str(e)}"
        
    return state

# Build Graph
eval_builder = StateGraph(EvaluationState)
eval_builder.add_node("eval_prompt", eval_prompt_node)
eval_builder.add_node("eval_llm", eval_llm_node)
eval_builder.add_node("eval_parse", eval_parse_node)

eval_builder.set_entry_point("eval_prompt")
eval_builder.add_edge("eval_prompt", "eval_llm")
eval_builder.add_edge("eval_llm", "eval_parse")
eval_builder.add_edge("eval_parse", END)

evaluation_graph = eval_builder.compile()
