FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --include=dev

COPY . .

ENV PORT=${PORT:-3000}
EXPOSE 3000

CMD ["sh", "-lc", "npx spacerizr workspace.dsl --port ${PORT:-3000}"]
