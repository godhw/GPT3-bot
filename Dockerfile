FROM node:16

WORKDIR /workspace

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 80

CMD [ "node", "bot.js" ]