import asyncpg, re, pathlib, asyncio
text = (pathlib.Path(__file__).parent / '.env').read_text()
url = re.search(r'DATABASE_URL=(\S+)', text).group(1).replace('postgresql+asyncpg://','postgresql://')
async def main():
    conn = await asyncpg.connect(dsn=url)
    try:
        row = await conn.fetchrow("SELECT version_num FROM alembic_version")
        print('alembic_version:', row['version_num'] if row else None)
    finally:
        await conn.close()

asyncio.run(main())
