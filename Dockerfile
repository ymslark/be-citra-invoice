FROM node:20-bookworm-slim

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

RUN mkdir -p uploads/faktur uploads/compressed

EXPOSE 8000

CMD ["npm", "start"]
