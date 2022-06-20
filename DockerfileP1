FROM registry1.dso.mil/ironbank/opensource/nodejs/nodejs16:16.15.0
WORKDIR /app
COPY --chown=node:node package*.json ./
COPY --chown=node:node pm2.test.config.js ./pm2.config.js
COPY --chown=node:node node_modules node_modules
COPY --chown=node:node src src
USER root
RUN mkdir /logs;exit 0
RUN mkdir /etc;exit 0
ENTRYPOINT chown -R node:node /logs && chown -R node:node etc && su - node -s /bin/bash && npm run run && npm run logs