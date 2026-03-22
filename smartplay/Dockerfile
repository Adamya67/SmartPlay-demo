FROM node:22-bullseye-slim AS deps
WORKDIR /app
ENV DATABASE_URL=postgresql://placeholder:placeholder@localhost:5432/smartplay?schema=public
COPY package.json package-lock.json ./
COPY prisma ./prisma
RUN npm ci

FROM node:22-bullseye-slim AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
ENV DATABASE_URL=postgresql://placeholder:placeholder@localhost:5432/smartplay?schema=public
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:22-bullseye-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
EXPOSE 3000
CMD ["sh", "-c", "HOSTNAME=0.0.0.0 node server.js"]
