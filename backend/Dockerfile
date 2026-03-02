FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY prisma ./prisma
COPY prisma.config.ts ./
RUN npx prisma generate

COPY dist ./dist
COPY src/generated ./src/generated

EXPOSE 5000

CMD ["node", "dist/server.js"]
