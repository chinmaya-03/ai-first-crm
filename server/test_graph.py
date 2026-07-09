from app.agents.graph import crm_graph

result = crm_graph.invoke(
    {
        "conversation": """
I met Dr. Sharma at Apollo Hospital.

We discussed Jardiance.

He liked the clinical trial results but said the medicine is expensive.

He asked me to visit next Tuesday with a brochure.
"""
    }
)

print(result)