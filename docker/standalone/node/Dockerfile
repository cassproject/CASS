FROM node:19-bullseye-slim
USER root
WORKDIR /app
COPY package.json ./
RUN apt update && apt dist-upgrade -y && apt clean
RUN npm install --production --omit=dev && npm upgrade --production --omit=dev && npm audit --production --omit=dev --audit-level=high --fix && chown root:root node_modules -R
COPY src src
EXPOSE 80
CMD node ./src/main/server.js