from __future__ import annotations

from datetime import date
from typing import Optional

from pydantic import BaseModel


class LogInteractionRequest(BaseModel):
    text: str
    created_by: Optional[str] = None


class LogInteractionResponse(BaseModel):
    hcp_id: str
    interaction_id: str
    doctor_name: str
    hospital: str
    specialty: str
    products_discussed: list[str]
    summary: str
    sentiment: str
    objections: list[str]
    follow_up_date: Optional[str] = None
    next_action: Optional[str] = None


class EditInteractionRequest(BaseModel):
    topics: Optional[str] = None
    outcomes: Optional[str] = None
    sentiment: Optional[str] = None
    follow_up_actions: Optional[str] = None
    products_discussed: Optional[list[str]] = None
    follow_up_date: Optional[str] = None
    next_action: Optional[str] = None


class EditInteractionResponse(BaseModel):
    id: str
    topics: str
    outcomes: Optional[str] = None
    sentiment: Optional[str] = None
    follow_up_actions: Optional[str] = None
    products_discussed: Optional[list[str]] = None
    follow_up_date: Optional[str] = None
    next_action: Optional[str] = None


class SearchHCPResponseItem(BaseModel):
    id: str
    name: str
    specialty: str
    hospital: str


class ViewInteractionItem(BaseModel):
    id: str
    date: date
    topics: str
    sentiment: str
    outcomes: Optional[str] = None


class RecommendRequest(BaseModel):
    hcp_id: str


class RecommendResponse(BaseModel):
    recommendation: str
