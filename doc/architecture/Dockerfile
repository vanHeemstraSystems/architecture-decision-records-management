ARG ARTIFACTORY_NPM_REGISTRY
ARG ARTIFACTORY_TOKEN
FROM node:12.21.0-alpine3.12
WORKDIR /usr/src/app
RUN apk update
RUN npm config set "//${ARTIFACTORY_NPM_REGISTRY}/:_authToken" "${ARTIFACTORY_TOKEN}"
COPY . .
EXPOSE 9090
CMD [ "npm", "run", "--debug" ]
