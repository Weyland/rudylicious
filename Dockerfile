# -------- Stage 1: Dependencies --------
FROM node:24 AS deps
WORKDIR /app

COPY package.json package-lock.json* pnpm-lock.yaml* ./

RUN \
    if [ -f pnpm-lock.yaml ]; then \
    npm install -g pnpm && pnpm install --frozen-lockfile; \
    elif [ -f package-lock.json ]; then \
    npm ci; \
    else \
    echo "No lock file found. Please add one."; \
    exit 1; \
    fi

# -------- Stage 2: Build --------
FROM node:24 AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NODE_ENV=production
RUN npm run build

# -------- Stage 3: Production Dependencies --------
FROM node:24-slim AS prod-deps
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci --omit=dev && npm cache clean --force

# -------- Stage 4: Final Distroless Image --------
FROM gcr.io/distroless/nodejs24 AS runner
WORKDIR /app

# Copy production node_modules & required app files
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000
CMD ["server.js"]
