# Define the node environment
FROM node:22-alpine
ARG NPM_TOKEN

COPY . /src
WORKDIR /src

RUN GITHUB_RUSSIAN_RS_NPM_TOKEN=${NPM_TOKEN}; npm install
RUN npm run build

EXPOSE 3000

CMD [ "node", "server.js" ]
