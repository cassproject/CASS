FROM node:19-bullseye-slim
USER root
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev && chown root:root node_modules -R
COPY src src
EXPOSE 80
CMD node ./src/main/server.js