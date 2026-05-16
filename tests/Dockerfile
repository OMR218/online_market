FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY tests ./tests

CMD ["npm", "run", "test:api"]
