import asyncio
import re
from pathlib import Path
import asyncpg

# Read DATABASE_URL from .env
env_path = Path(__file__).parent / '.env'
text = env_path.read_text()
match = re.search(r'DATABASE_URL=(\S+)', text)
if not match:
    raise SystemExit('DATABASE_URL not found in .env')
url = match.group(1).replace('postgresql+asyncpg://', 'postgresql://')

async def main():
    conn = await asyncpg.connect(dsn=url)
    try:
        print('Tables:')
        rows = await conn.fetch("SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname = 'public' ORDER BY tablename;")
        for r in rows:
            print('-', r['tablename'])
        print('\nEnums:')
        rows = await conn.fetch("SELECT t.typname FROM pg_type t JOIN pg_enum e ON t.oid = e.enumtypid GROUP BY t.typname;")
        for r in rows:
            print('-', r['typname'])
    finally:
        await conn.close()

asyncio.run(main())
