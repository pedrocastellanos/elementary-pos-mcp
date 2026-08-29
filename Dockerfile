ARG NODE_VERSION=22

FROM node:${NODE_VERSION}-alpine AS builder
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@10.11.0 --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.json ./
COPY src ./src

RUN pnpm install --frozen-lockfile --allow-build=esbuild \
 && pnpm run build \
 && pnpm prune --prod

FROM node:${NODE_VERSION}-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

RUN chown -R appuser:appgroup /app
USER appuser

ENV ELEMENTARY_POS_BASE_URL=https://api.elementarypos.com
ENV ELEMENTARY_POS_TIMEOUT_MS=15000

CMD ["node", "dist/index.js"]
