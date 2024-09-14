# Define the node environment
FROM node:22-alpine
ARG GITHUB_TOKEN

COPY . /src
WORKDIR /src

RUN GITHUB_RUSSIAN_RS_NPM_TOKEN=$GITHUB_TOKEN; npm install
RUN npm run build

EXPOSE 3000

CMD [ "node", "server.js" ]
