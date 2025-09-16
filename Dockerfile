FROM node:24
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY src src
ENTRYPOINT ["node","src/main/server.js"]