FROM node:18-alpine

WORKDIR /app

COPY app/package.json ./
RUN npm install --production

COPY app/ ./

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
ENV PORT=3000

EXPOSE 3000

CMD ["node", "server.js"]
