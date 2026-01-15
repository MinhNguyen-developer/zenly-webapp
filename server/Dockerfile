# Backend Dockerfile
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main"]
# Run migrations and start

EXPOSE 3001

USER nestjs

RUN chown -R nestjs:nodejs /app
# Set ownership

COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
# Copy necessary files

RUN adduser --system --uid 1001 nestjs
RUN addgroup --system --gid 1001 nodejs
# Create non-root user

ENV NODE_ENV=production

WORKDIR /app
FROM base AS runner
# Production image

RUN npm run build
# Build NestJS application

COPY . .
COPY --from=deps /app/node_modules ./node_modules
WORKDIR /app
FROM base AS builder
# Build the application

RUN npx prisma generate
# Generate Prisma Client

RUN npm ci
# Install dependencies

COPY prisma ./prisma/
COPY package*.json ./
# Copy package files

WORKDIR /app
FROM base AS deps
# Install dependencies only when needed

FROM node:20-alpine AS base

