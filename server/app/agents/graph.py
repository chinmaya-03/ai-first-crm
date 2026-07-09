from langgraph.graph import StateGraph, END

from app.agents.state import CRMState
from app.agents.nodes import extract_interaction


builder = StateGraph(CRMState)

builder.add_node(
    "extract_interaction",
    extract_interaction,
)

builder.set_entry_point("extract_interaction")

builder.add_edge(
    "extract_interaction",
    END,
)

crm_graph = builder.compile()