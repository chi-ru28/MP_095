import uuid
from typing import Dict, Any, TypedDict
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import PromptTemplate
from langgraph.graph import StateGraph, END
from pydantic import ValidationError

from config.settings import settings
from models.schemas import TaskGenerationRequest, TaskGenerationResponse

# Define State
class GenerationState(TypedDict):
    request: Dict[str, Any]
    llm_output: str
    final_response: Dict[str, Any]
    error: str

# Nodes
def generate_prompt_node(state: GenerationState) -> GenerationState:
    req = TaskGenerationRequest(**state["request"])
    
    # Calculate target difficulty text
    diff_text = "Easy"
    if req.confidence_score > 0.7:
        diff_text = "Hard"
    elif req.confidence_score > 0.4:
        diff_text = "Medium"
        
    prompt = f"""
    You are an AI Game Master for an adventure game.
    The player is exploring a world with the theme: {req.theme}.
    Recent topics covered: {', '.join(req.recent_topics)}.
    Target difficulty: {diff_text}.
    
    Generate a JSON response containing a unique puzzle or challenge scenario.
    It MUST be strictly valid JSON matching this schema:
    {{
        "topic": "String describing the specific topic (e.g., Logic puzzle, Math, Riddle)",
        "difficulty_label": "{diff_text}",
        "time_limit_seconds": Int (60 to 300),
        "scenario": "String. A 2-4 sentence narrative puzzle.",
        "hints": ["String", "String"]
    }}
    """
    state["request"]["_prompt"] = prompt
    return state

def call_llm_node(state: GenerationState) -> GenerationState:
    try:
        if not settings.gemini_api_key:
            # Fallback for dev without API key
            state["llm_output"] = '{"topic": "Mock Topic", "difficulty_label": "Medium", "time_limit_seconds": 120, "scenario": "Mock scenario because no API key.", "hints": ["Hint 1"]}'
            return state

        llm = ChatGoogleGenerativeAI(
            model="gemini-1.5-flash",
            google_api_key=settings.gemini_api_key,
            temperature=0.7
        )
        response = llm.invoke(state["request"]["_prompt"])
        state["llm_output"] = response.content
    except Exception as e:
        state["error"] = str(e)
    return state

def parse_output_node(state: GenerationState) -> GenerationState:
    import json
    if "error" in state and state["error"]:
        return state
        
    try:
        # Strip potential markdown blocks
        clean_json = state["llm_output"].strip().strip('```json').strip('```').strip()
        data = json.loads(clean_json)
        
        # Add generated UUID
        data["task_id"] = str(uuid.uuid4())
        
        # Validate through Pydantic
        validated = TaskGenerationResponse(**data)
        state["final_response"] = validated.model_dump()
    except Exception as e:
        state["error"] = f"Parsing failed: {str(e)} | Output: {state.get('llm_output')}"
        
    return state

# Build Graph
builder = StateGraph(GenerationState)
builder.add_node("generate_prompt", generate_prompt_node)
builder.add_node("call_llm", call_llm_node)
builder.add_node("parse_output", parse_output_node)

builder.set_entry_point("generate_prompt")
builder.add_edge("generate_prompt", "call_llm")
builder.add_edge("call_llm", "parse_output")
builder.add_edge("parse_output", END)

generation_graph = builder.compile()
