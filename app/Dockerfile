FROM node:22-alpine AS deps
WORKDIR /app
ARG NODE_HEAP_MB=768
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_OPTIONS=--max-old-space-size=${NODE_HEAP_MB}
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

FROM node:22-alpine AS builder
WORKDIR /app
ARG NODE_HEAP_MB=768
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_OPTIONS=--max-old-space-size=${NODE_HEAP_MB}
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME=0.0.0.0
ENV PORT=3030

RUN addgroup -S nodejs && adduser -S nextjs -G nodejs

COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./

# Ensure data directories have proper permissions
RUN mkdir -p /app/src/data /app/public/uploads && \
    chown -R nextjs:nodejs /app/src/data /app/public/uploads && \
    chmod 755 /app/src/data /app/public/uploads

USER nextjs
EXPOSE 3030

CMD ["node", "server.js"]
