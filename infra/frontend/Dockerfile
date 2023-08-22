FROM node:20.2.0

WORKDIR /usr/src/app

COPY ./package*.json ./

RUN npm init -y & \
    npm install

COPY . .

EXPOSE 8080
CMD [ "npm", "run", "serve"]