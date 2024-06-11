FROM node:alpine
WORKDIR /usr/local/bookreview
COPY index.js .
COPY package.json .
COPY router router/
RUN npm install &&\
    apk update &&\
    apk upgrade
EXPOSE 5002
CMD npm start
