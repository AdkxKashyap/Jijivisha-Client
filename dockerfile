FROM node:12.16.1-alpine As builder
WORKDIR /usr/src/app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npm run postinstall

CMD [ "npm", "start" ]
