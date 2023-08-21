FROM node:20.2.0

WORKDIR /usr/src/app

COPY ./package*.json ./

RUN npm init -y & \
    npm install

COPY . .

EXPOSE 3000
CMD [ "npm", "run", "lint"]
CMD [ "npm", "run", "format"]
CMD [ "npm", "run", "start:dev"]