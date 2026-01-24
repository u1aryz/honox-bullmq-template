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
# Production dependencies stage
# ==========================================
FROM base AS prod-deps

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile --prod

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

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

WORKDIR /app/dist

# Copy production dependencies and built files (owned by node user)
COPY --chown=node:node --from=prod-deps /app/node_modules /app/node_modules
COPY --chown=node:node --from=builder /app/dist ./
COPY --chown=node:node --from=builder /app/package.json /app/package.json

# Run as non-root user
USER node

EXPOSE ${APP_PORT}
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "index.js"]