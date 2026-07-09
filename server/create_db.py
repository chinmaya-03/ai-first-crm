"""Create the crm_hcp database if it doesn't exist."""
import asyncio
import asyncpg


async def main():
    # Connect to default 'postgres' database
    conn = await asyncpg.connect(
        user="postgres",
        password="chinmaya",
        host="localhost",
        port=5432,
        database="postgres",
    )
    
    # Check if crm_hcp exists
    exists = await conn.fetchval(
        "SELECT 1 FROM pg_database WHERE datname = 'crm_hcp'"
    )
    
    if exists:
        print("Database 'crm_hcp' already exists.")
    else:
        await conn.execute("CREATE DATABASE crm_hcp")
        print("Database 'crm_hcp' created successfully!")
    
    await conn.close()


asyncio.run(main())
