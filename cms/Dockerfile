# Strapi Production Build
FROM node:20-alpine AS builder

RUN apk add --no-cache build-base gcc autoconf automake zlib-dev libpng-dev vips-dev

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source
COPY . .

# Build Strapi admin
ENV NODE_ENV=production
RUN npm run build

# Production
FROM node:20-alpine

RUN apk add --no-cache vips-dev

WORKDIR /app

# Copy built app
COPY --from=builder /app ./

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=1337

EXPOSE 1337

CMD ["npm", "run", "start"]
