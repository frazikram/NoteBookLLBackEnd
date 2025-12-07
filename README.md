

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

**Notebook LLM Backend**

- **Project:** `notebook-llm-backend`
- **Purpose:** Backend API for NoteBookLLMLite — provides Notebook, Note, Chat, LLM and RAG endpoints using NestJS and Prisma.

**Quick Start**

- **Requirements:** Node.js >= 18, npm or pnpm, and a supported database for Prisma (e.g., PostgreSQL, SQLite for local/dev).
- **Install dependencies:**

```bash
npm install
```

- **Environment variables (example):**

```
DATABASE_URL="postgresql://user:pass@localhost:5432/notebook"
OPENAI_API_KEY="sk-..."
PORT=3333
```

Place them in a `.env` file at the repository root.

**Prisma (database) setup**

- Generate Prisma client:

```bash
npx prisma generate
```

- Run migrations (development):

```bash
npx prisma migrate dev --name init
```

- Optionally run seed (if `prisma/seed.ts` is implemented):

```bash
npm run prisma:seed || node prisma/seed.js
```

**Run the app**

- Development (watch): `npm run start:dev`
- Build: `npm run build`
- Production (after build): `npm run start:prod`

**Scripts**

- `npm run start` — start Nest app
- `npm run start:dev` — start in watch/dev mode
- `npm run build` — compile TypeScript
- `npm run test` — run unit tests
- `npm run test:e2e` — run e2e tests

See the `package.json` for the full list of scripts.

**API - High level**

The application exposes REST routes organized by modules. Key modules include:

- `notebooks` — create/update/list notebooks
- `notes` — create/update/list notes
- `chat` — chat session management and messaging
- `llm` — direct LLM endpoints (chat/streaming requests)
- `rag` — retrieval-augmented generation endpoints

Example: create a notebook (replace host/port if necessary):

```bash
curl -X POST http://localhost:3333/notebooks \
  -H "Content-Type: application/json" \
  -d '{"title":"My Notebook"}'
```

Example: send a chat message:

```bash
curl -X POST http://localhost:3333/chat/sessions/:id/message \
  -H "Content-Type: application/json" \
  -d '{"text":"Hello"}'
```

Adjust routes and payloads based on the DTOs in `src/**/dto`.

**Environment variables reference**

- `DATABASE_URL` — Prisma connection string
- `OPENAI_API_KEY` — API key used by LLM adapters (if using OpenAI)
- `PORT` — port the Nest server listens on (default in code often 3000/3333)

**Development notes**

- The codebase uses NestJS (v11), Prisma (v5), and LangChain packages.
- Source entry: `src/main.ts`.
- Modules live under `src/` (e.g., `src/notebooks`, `src/notes`, `src/chat`, `src/llm`, `src/rag`).

**Testing**

- Unit tests: `npm run test`
- E2E tests: `npm run test:e2e`

**Troubleshooting**

- If you see TypeScript import errors (e.g., "Cannot find module './llm.controller'"), ensure paths and filenames match — imports are case-sensitive on some systems. Verify `src/llm/llm.controller.ts` exists and exports the controller class.
- Run `npm run build` to surface TypeScript errors.
- Ensure `npx prisma generate` has been run so Prisma client imports resolve.

**Contributing**

- Fork the repo, create a feature branch, open a pull request with a clear description and tests where applicable.

**License**

- This repository currently lists its license as `UNLICENSED` in `package.json`. Update as needed.

---

If you'd like, I can also add usage examples for each endpoint, create an OpenAPI spec, or add a small Postman collection. Which would you prefer next?
