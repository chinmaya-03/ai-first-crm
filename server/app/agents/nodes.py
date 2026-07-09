import json

from app.ai.groq_client import get_llm
from app.ai.prompts import INTERACTION_EXTRACTION_PROMPT


def extract_interaction(state):
    """
    LangGraph node:
    Takes conversation text
    Uses Groq to extract structured CRM information
    """

    llm = get_llm()

    chain = INTERACTION_EXTRACTION_PROMPT | llm

    response = chain.invoke(
        {
            "conversation": state["conversation"]
        }
    )

    try:
        data = json.loads(response.content)
    except Exception:
        data = {
            "error": "LLM did not return valid JSON",
            "raw_output": response.content,
        }

    return {
        "conversation": state["conversation"],
        "extracted_data": data,
    }