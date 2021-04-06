FROM node:15
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY src src
CMD [ "npm", "run", "run" ]