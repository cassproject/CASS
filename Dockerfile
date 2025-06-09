FROM node:20
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY src src
ENTRYPOINT ["node","src/main/server.js"]