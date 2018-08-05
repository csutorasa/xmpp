FROM node:8-alpine

COPY . /app/
WORKDIR /app
RUN npm install --unsafe-perm

CMD [ "node", "/app/dist/server.js"]