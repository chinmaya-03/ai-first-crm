"""Lightweight LangGraph-style workflow module.

The repository environment here does not permit creating new package directories
via the helper tool used by this session, so this module provides the same
workflow implementation as a single-file module at app/agents.py. It is easy to
move into a proper package later if desired.
"""
from __future__ import annotations

from typing import Any, Dict
import logging

from app.tools.groq_client import analyze_text_with_groq

logger = logging.getLogger("app.agents.langgraph_workflow")


class LangGraphWorkflow:
    """Minimal representation of a workflow that performs Groq extraction
    and returns structured JSON suitable for downstream tools/nodes.

    The name references LangGraph to make it easier to adapt to a full
    LangGraph flow later. This implementation executes locally and is
    deterministic: it calls the same extraction function used by the
    FastAPI endpoints.
    """

    def __init__(self) -> None:
        pass

    def run(self, text: str) -> Dict[str, Any]:
        """Run the workflow: extract fields from text using Groq and return them."""
        logger.info("Running LangGraphWorkflow on input (len=%d)", len(text))
        data = analyze_text_with_groq(text)
        # Ensure the keys required by the assignment are present
        normalized = {
            "doctor_name": data.get("doctor_name"),
            "hospital": data.get("hospital"),
            "specialty": data.get("specialty"),
            "products_discussed": data.get("products_discussed") or [],
            "summary": data.get("summary") or data.get("interaction_summary"),
            "sentiment": data.get("sentiment"),
            "objections": data.get("objections") or [],
            "follow_up_date": data.get("follow_up_date"),
            "next_action": data.get("next_action"),
        }
        logger.debug("Workflow output: %s", normalized)
        return normalized


# Simple CLI test so the workflow can be executed manually for verification
if __name__ == "__main__":
    import sys

    logging.basicConfig(level=logging.INFO)
    sample = (
        "Met with Dr. John Doe at St. Mary Hospital. He is in cardiology. Discussed Product-123 and Product-xyz. "
        "He seemed interested but had some concerns about pricing. Follow up on 2026-07-23."
    )
    wf = LangGraphWorkflow()
    out = wf.run(sample if len(sys.argv) == 1 else " ".join(sys.argv[1:]))
    print(out)
