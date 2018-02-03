FROM node:8.9.4
USER node

RUN mkdir /home/node/app
WORKDIR /home/node/app

COPY ./src/package*.json ./
RUN npm install