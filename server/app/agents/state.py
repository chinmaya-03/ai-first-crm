from typing import TypedDict


class CRMState(TypedDict):
    conversation: str
    extracted_data: dict