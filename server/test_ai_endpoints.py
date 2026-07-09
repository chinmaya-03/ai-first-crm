import asyncio

import httpx

from app.agents.graph import crm_graph
from app.main import create_app


def test_ai_endpoints_flow():
    app = create_app()

    conversation = (
        "Met Dr. Sarah Chen at Memorial Cancer Center. "
        "Discussed ProductX and received positive feedback. "
        "She requested samples and asked for a follow-up on 2026-07-23."
    )

    async def run_flow() -> None:
        transport = httpx.ASGITransport(app=app)
        async with httpx.AsyncClient(transport=transport, base_url="http://testserver") as client:
            graph_result = crm_graph.invoke({"conversation": conversation})
            assert isinstance(graph_result.get("extracted_data"), dict)

            log_resp = await client.post(
                "/api/v1/ai/log-interaction",
                json={"text": conversation},
            )
            assert log_resp.status_code == 200, log_resp.text
            log_payload = log_resp.json()
            assert log_payload["hcp_id"]
            assert log_payload["interaction_id"]
            assert log_payload["summary"]

            hcp_id = log_payload["hcp_id"]

            search_resp = await client.get(
                "/api/v1/ai/search-hcp",
                params={"doctor_name": "Sarah"},
            )
            assert search_resp.status_code == 200, search_resp.text
            search_payload = search_resp.json()
            assert any(item["id"] == hcp_id for item in search_payload)

            history_resp = await client.get(f"/api/v1/ai/history/{hcp_id}")
            assert history_resp.status_code == 200, history_resp.text
            history_payload = history_resp.json()
            assert history_payload

            edit_resp = await client.put(
                f"/api/v1/ai/edit-interaction/{history_payload[0]['id']}",
                json={"topics": "Updated topics from automated test"},
            )
            assert edit_resp.status_code == 200, edit_resp.text

            recommend_resp = await client.post(
                "/api/v1/ai/recommend-next",
                json={"hcp_id": hcp_id},
            )
            assert recommend_resp.status_code == 200, recommend_resp.text
            assert recommend_resp.json()["recommendation"]

    asyncio.run(run_flow())
