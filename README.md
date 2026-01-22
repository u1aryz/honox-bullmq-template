# honox-bullmq-template

A starter template for honox + bullmq.

## Prerequisites

- [Docker Compose](https://docs.docker.com/compose/)
- [pnpm](https://pnpm.io/)

## Getting started

```bash
pnpm dlx degit u1aryz/honox-bullmq-template my-app
cd my-app
cp .env.example .env
# Edit .env as needed
pnpm install
```

## Tasks

| Command                                     | Description               |
| ------------------------------------------- | ------------------------- |
| `docker compose up --build --watch`         | Start in development mode |
| `docker compose -f compose.yaml up --build` | Start in production mode  |
| `pnpm run format && pnpm run typecheck`     | Format and type check     |
