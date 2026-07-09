"""Small wrapper for calling Groq (with safe mock fallback)."""
from __future__ import annotations

import logging
import os
from typing import Any, Dict

from app.core.config import settings

logger = logging.getLogger("app.tools.groq_client")


def analyze_text_with_groq(text: str) -> Dict[str, Any]:
    """Call Groq model to extract structured interaction data.

    Falls back to a simple heuristic extractor if GROQ_API_KEY is not set
    or if the Groq client fails.
    """
    api_key = settings.GROQ_API_KEY
    if not api_key:
        logger.info("GROQ_API_KEY not configured — using mock extractor")
        return _mock_extract(text)

    # Try to use langchain-groq / groq package if available
    try:
        try:
            # langchain_groq integration (preferred)
            from langchain_groq import Groq

            llm = Groq(api_key=api_key, model="gemma2-9b-it")
            prompt = _build_extraction_prompt(text)
            result = llm(prompt)
            # Expecting result as text; parse JSON if possible
            return _parse_groq_output(result)
        except Exception:
            # fallback to groq package
            import groq

            client = groq.Client(api_key=api_key)
            prompt = _build_extraction_prompt(text)
            resp = client.predict(model="gemma2-9b-it", input=prompt)
            return _parse_groq_output(resp)
    except Exception as exc:
        logger.exception("Groq call failed, falling back to mock: %s", exc)
        return _mock_extract(text)


def _build_extraction_prompt(text: str) -> str:
    return (
        "Extract the following fields from this conversation text as JSON: doctor_name, hospital, specialty, "
        "products_discussed (list), summary, sentiment (positive/neutral/negative), objections (list), "
        "follow_up_date (YYYY-MM-DD or null), next_action. Conversation:\n" + text
    )


def _parse_groq_output(output: Any) -> Dict[str, Any]:
    # If the Groq return is already a dict-like, try to normalize; otherwise try to parse JSON
    import json

    if isinstance(output, dict):
        # ensure both 'summary' and 'interaction_summary' are present for compatibility
        if 'summary' not in output and 'interaction_summary' in output:
            output['summary'] = output.get('interaction_summary')
        return output
    if hasattr(output, "__call__"):
        # weird LLM wrapper, call to get text
        text = output()
    else:
        text = str(output)

    try:
        parsed = json.loads(text)
        # compatibility mapping
        if 'summary' not in parsed and 'interaction_summary' in parsed:
            parsed['summary'] = parsed.get('interaction_summary')
        return parsed
    except Exception:
        # last resort: return mock
        logger.warning("Unable to parse Groq output as JSON, returning mock")
        return _mock_extract(text)


def _mock_extract(text: str) -> Dict[str, Any]:
    # Extremely simple heuristics to extract some fields
    import re
    from datetime import datetime, timedelta

    doctor_match = re.search(r"Dr\.\s+([A-Za-z ]+)", text)
    hospital_match = re.search(r"at\s+([A-Za-z0-9 ,.]+?)(?:\.|,|$)", text)
    specialty_match = re.search(r"(oncology|cardiology|neurology|pediatrics|surgery)", text, re.I)
    products = re.findall(r"Product\s+([A-Za-z0-9-]+)", text)

    follow_up_date = None
    date_match = re.search(r"(\d{4}-\d{2}-\d{2})", text)
    if date_match:
        follow_up_date = date_match.group(1)
    else:
        # default follow-up in 14 days
        follow_up_date = (datetime.utcnow() + timedelta(days=14)).date().isoformat()

    sentiment = "neutral"
    if "interested" in text or "positive" in text:
        sentiment = "positive"
    if "not interested" in text or "concern" in text or "concerns" in text:
        sentiment = "negative"

    summary_text = text[:400]

    return {
        "doctor_name": doctor_match.group(1).strip() if doctor_match else "Unknown",
        "hospital": hospital_match.group(1).strip() if hospital_match else "Unknown",
        "specialty": specialty_match.group(1).lower() if specialty_match else "general",
        "products_discussed": products or [],
        "interaction_summary": summary_text,
        "summary": summary_text,
        "sentiment": sentiment,
        "objections": [],
        "follow_up_date": follow_up_date,
        "next_action": "schedule_follow_up",
    }
