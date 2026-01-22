# honox-bullmq-template

A starter template for honox + bullmq.

## Prerequisites

- [Docker Compose](https://docs.docker.com/compose/)
- [mise](https://mise.jdx.dev/)

## Getting started

```bash
pnpm dlx degit u1aryz/honox-bullmq-template#mise my-app
cd my-app
cp .env.example .env
# Edit .env as needed
mise install
```

## Tasks

| Command           | Description               |
| ----------------- | ------------------------- |
| `mise run dev`    | Start in development mode |
| `mise run start`  | Start in production mode  |
| `mise run format` | Format and type check     |
