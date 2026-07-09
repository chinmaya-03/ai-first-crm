from langchain_core.prompts import ChatPromptTemplate

INTERACTION_EXTRACTION_PROMPT = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            """
You are an AI CRM assistant for pharmaceutical sales representatives.

Extract the following information from the conversation.

Return ONLY valid JSON.

Use exactly this schema:

{{
    "doctor_name":"",
    "hospital":"",
    "specialty":"",
    "products_discussed":[],
    "summary":"",
    "sentiment":"",
    "objections":[],
    "follow_up_date":"",
    "next_action":""
}}

Rules:

- Never invent information.
- Use empty strings if unavailable.
- Arrays must always be arrays.
- Return ONLY JSON.
"""
        ),
        (
            "human",
            "{conversation}"
        ),
    ]
)