FROM node:16
WORKDIR /app
COPY package*.json ./
COPY pm2.test.config.js ./pm2.config.js
RUN npm install
COPY src src
CMD npm run run && npm run logs