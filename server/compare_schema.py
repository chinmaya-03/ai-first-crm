import asyncio
import re
from pathlib import Path
import asyncpg
import sys
from importlib import import_module

# Add server folder to path
sys.path.insert(0, str(Path(__file__).parent))

# Load models package to populate metadata
import app.models as models  # noqa: E402
from app.database.base import Base

# Read DB URL
env_path = Path(__file__).parent / '.env'
text = env_path.read_text()
match = re.search(r'DATABASE_URL=(\S+)', text)
if not match:
    raise SystemExit('DATABASE_URL not found in .env')
url = match.group(1).replace('postgresql+asyncpg://', 'postgresql://')

async def main():
    # DB tables
    conn = await asyncpg.connect(dsn=url)
    try:
        db_tables = [r['tablename'] for r in await conn.fetch("SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname = 'public' ORDER BY tablename;")]
    finally:
        await conn.close()

    model_tables = list(Base.metadata.tables.keys())

    print('Model tables (metadata):')
    for t in model_tables:
        print('-', t)
    print('\nDB tables:')
    for t in db_tables:
        print('-', t)

    missing_in_db = [t for t in model_tables if t not in db_tables]
    extra_in_db = [t for t in db_tables if t not in model_tables and t!='alembic_version']

    print('\nMissing in DB:', missing_in_db)
    print('Extra in DB:', extra_in_db)

asyncio.run(main())
