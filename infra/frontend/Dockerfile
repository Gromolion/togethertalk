FROM node:20.2.0

WORKDIR /usr/src/app

COPY ./package*.json ./

RUN npm init -y & \
    npm install -g @vue/cli@latest & \
    npm install & \
    chown 1000:1000 -R /usr/src/app

USER 1000

COPY . .

EXPOSE 8080
CMD /bin/bash -c "npm init -y; npm install; npm run serve"
