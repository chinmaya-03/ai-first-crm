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
url = match.group(1)
# asyncpg expects a DSN like 'postgresql://', convert SQLAlchemy-style URL if needed
url = url.replace('postgresql+asyncpg://', 'postgresql://')

async def main():
    conn = await asyncpg.connect(dsn=url)
    try:
        print('Dropping enums if they exist...')
        for t in ('interaction_type','sentiment_type','task_priority','task_status'):
            await conn.execute(f"DROP TYPE IF EXISTS {t} CASCADE;")
            print(f'Dropped {t} (if existed)')
    finally:
        await conn.close()

asyncio.run(main())
