# Dockerfile optimizado para Next.js 14
# Multi-stage build para reducir el tamaño de la imagen

# Etapa 1: Dependencias
FROM node:18-alpine AS deps
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

# Copiar archivos de dependencias
COPY package.json package-lock.json* ./
# Evitar que prisma generate se ejecute en postinstall durante la instalación de dependencias
ENV PRISMA_SKIP_POSTINSTALL_GENERATE=1
RUN npm install --no-audit --no-fund

# Etapa 2: Builder
FROM node:18-alpine AS builder
RUN apk add --no-cache openssl
WORKDIR /app

# Copiar dependencias desde la etapa anterior
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Asegurar generación del cliente de Prisma antes del build
RUN npx prisma generate

# Variables de entorno para el build
ENV NEXT_TELEMETRY_DISABLED=1

# Build de la aplicación
RUN npm run build

# Etapa 3: Runner (imagen final)
FROM node:18-alpine AS runner
RUN apk add --no-cache openssl
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Crear usuario no-root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copiar archivos necesarios
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma

USER nextjs

EXPOSE 3001

ENV PORT=3001
ENV HOSTNAME="0.0.0.0"

# Ejecutar migraciones y luego iniciar la app
CMD ["sh", "-c", "npx prisma migrate deploy || npx prisma db push; node server.js"]

