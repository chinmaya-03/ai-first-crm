# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.

## AI / Groq Setup

This project supports a Groq-based AI integration used to extract structured data from free-text interactions.

1. Add your `GROQ_API_KEY` to the backend env file: `server/.env`:

```
GROQ_API_KEY=your_api_key_here
```

2. The backend will fall back to a lightweight mock extractor if `GROQ_API_KEY` is not set.

3. The AI endpoints are available under `/api/v1/ai`:

- `POST /api/v1/ai/log_interaction` — body: `{ "text": "..." }`
- `PUT /api/v1/ai/edit_interaction` — body: edit fields
- `GET /api/v1/ai/search_hcp` — query params: `name`, `hospital`, `specialty`
- `GET /api/v1/ai/view_interactions?hcp_id=...`
- `POST /api/v1/ai/recommend_next_action` — body: `{ "hcp_id": "..." }`

4. Run the backend as usual. The project uses a virtualenv at `d:\CRM\.venv311` during local development in this workspace.

