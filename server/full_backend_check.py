import asyncio
import re
from pathlib import Path
import asyncpg
import httpx

env_path = Path(__file__).parent / '.env'
text = env_path.read_text()
url = re.search(r'DATABASE_URL=(\S+)', text).group(1).replace('postgresql+asyncpg://', 'postgresql://')

async def check_alembic():
    conn = await asyncpg.connect(dsn=url)
    try:
        row = await conn.fetchrow("SELECT version_num FROM alembic_version;")
        return row['version_num']
    finally:
        await conn.close()


def check_http():
    out = {}
    r = httpx.get('http://127.0.0.1:8000/docs', timeout=10.0)
    out['docs_status'] = r.status_code
    out['docs_len'] = len(r.text)
    r2 = httpx.get('http://127.0.0.1:8000/health', timeout=10.0)
    out['health_status'] = r2.status_code
    try:
        out['health_json'] = r2.json()
    except Exception as e:
        out['health_json'] = str(e)
    return out

if __name__ == '__main__':
    alembic_ver = asyncio.run(check_alembic())
    print('alembic_version:', alembic_ver)
    http = check_http()
    print('/docs:', http['docs_status'], 'length=', http['docs_len'])
    print('/health:', http['health_status'], 'json=', http['health_json'])
