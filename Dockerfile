# Define the node environment
FROM node:22-alpine

COPY . /src
WORKDIR /src

RUN npm install
RUN npm run build

EXPOSE 3000

CMD [ "node", "server.js" ]
