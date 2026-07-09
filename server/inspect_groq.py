import importlib
for mod in ('langchain_groq','groq'):
    try:
        m=importlib.import_module(mod)
        print(mod, '=>', [a for a in dir(m) if not a.startswith('_')][:80])
    except Exception as e:
        print('ERROR importing', mod, e)
