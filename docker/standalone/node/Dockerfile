FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY src src
EXPOSE 80
CMD node ./src/main/server.js