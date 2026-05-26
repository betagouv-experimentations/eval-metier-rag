FROM node:22-alpine AS base

# All deps (dev + prod) for the build stage.
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

# Production-only deps for the runner stage. Kept on a separate
# layer so the final image excludes Playwright, eslint, drizzle-kit,
# tsx, etc.
FROM base AS prod-deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/drizzle ./drizzle
COPY --from=builder /app/scripts/migrate.mjs ./scripts/migrate.mjs

EXPOSE 3000
ENV PORT=3000
# Apply pending Drizzle migrations against DATABASE_URL, then start.
# If migrate fails the container exits, Coolify reports the failure,
# and no half-migrated state is reached.
CMD ["sh", "-c", "node scripts/migrate.mjs && node node_modules/next/dist/bin/next start -p $PORT"]
