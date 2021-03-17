FROM node:14
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY src src
CMD [ "npm", "run", "run" ]