# ---- builder ----
FROM node:22-bookworm-slim AS builder

RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 make g++ pkg-config \
    libcairo2-dev libpango1.0-dev libjpeg62-turbo-dev \
    libgif-dev librsvg2-dev libpixman-1-dev \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# next.config.ts (empty) shadows next.config.js (has transpilePackages).
# Remove it so the .js config is picked up.
RUN rm -f next.config.ts

RUN npm run build

# ---- runner ----
FROM node:22-bookworm-slim AS runner

WORKDIR /app
ENV NODE_ENV=production

# Copy the built output and production deps
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/next.config.js ./

EXPOSE 3000

CMD ["npm", "start"]
