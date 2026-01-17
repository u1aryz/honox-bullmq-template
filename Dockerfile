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

COPY --from=deps /app/node_modules ./node_modules
COPY . .

EXPOSE 5173
CMD ["pnpm", "dev", "--host"]

# ==========================================
# Build stage
# ==========================================
FROM base AS builder

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN pnpm build

# ==========================================
# Production stage
# ==========================================
FROM base AS prod

ENV NODE_ENV=production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 8080
CMD ["pnpm", "start"]