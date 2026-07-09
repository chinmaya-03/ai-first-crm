import asyncio, re
from pathlib import Path
import asyncpg

text = Path(__file__).parent.joinpath('.env').read_text()
url = re.search(r'DATABASE_URL=(\S+)', text).group(1).replace('postgresql+asyncpg://','postgresql://')

async def main():
    conn = await asyncpg.connect(dsn=url)
    try:
        row = await conn.fetchrow("SELECT version_num FROM alembic_version;")
        print(row['version_num'])
    finally:
        await conn.close()

asyncio.run(main())
