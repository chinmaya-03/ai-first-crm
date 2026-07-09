"""Drop all existing tables and enums for a clean slate."""
import asyncio
import asyncpg


async def main():
    conn = await asyncpg.connect(
        user="postgres",
        password="chinmaya",
        host="localhost",
        port=5432,
        database="crm_hcp",
    )

    await conn.execute("DROP TABLE IF EXISTS audit_logs CASCADE")
    await conn.execute("DROP TABLE IF EXISTS followups CASCADE")
    await conn.execute("DROP TABLE IF EXISTS samples_distributed CASCADE")
    await conn.execute("DROP TABLE IF EXISTS materials_shared CASCADE")
    await conn.execute("DROP TABLE IF EXISTS interaction CASCADE")
    await conn.execute("DROP TABLE IF EXISTS hcp CASCADE")
    await conn.execute("DROP TABLE IF EXISTS users CASCADE")
    await conn.execute("DROP TABLE IF EXISTS alembic_version CASCADE")
    await conn.execute("DROP TYPE IF EXISTS interaction_type")
    await conn.execute("DROP TYPE IF EXISTS sentiment_type")
    await conn.execute("DROP TYPE IF EXISTS task_priority")
    await conn.execute("DROP TYPE IF EXISTS task_status")

    print("All tables and enums dropped. Clean slate ready.")
    await conn.close()


asyncio.run(main())
