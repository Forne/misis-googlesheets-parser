FROM node:21 AS builder

WORKDIR /app

COPY . .
RUN npm install
RUN npm run build

FROM node:21-alpine

WORKDIR /app
ENV NODE_ENV production

COPY package*.json ./
RUN npm install --only=production

COPY --from=builder /app/dist ./

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

ENTRYPOINT ["node","./app.js"]