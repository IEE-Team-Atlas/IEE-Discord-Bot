FROM node:22.6.0-alpine

WORKDIR /bot

COPY package*.json ./

RUN npm install

COPY . .

CMD [ "npm", "start" ]