# syntax=docker/dockerfile:1

# ==========================================
# Base stage
# ==========================================
FROM node:22-alpine AS base

RUN corepack enable pnpm
WORKDIR /app

# ==========================================
# Dependencies stage
# ==========================================
FROM base AS deps

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

# ==========================================
# Development stage
# ==========================================
FROM base AS dev

ARG APP_PORT=3000
ENV APP_PORT=${APP_PORT}

COPY --from=deps /app/node_modules ./node_modules
COPY . .

EXPOSE ${APP_PORT}
CMD pnpm dev --host --port ${APP_PORT}

# ==========================================
# Build stage
# ==========================================
FROM base AS builder

ARG APP_PORT=3000
ENV APP_PORT=${APP_PORT}

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN pnpm build

# ==========================================
# Production stage
# ==========================================
FROM base AS prod

ARG APP_PORT=3000
ENV NODE_ENV=production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE ${APP_PORT}
CMD ["pnpm", "start"]