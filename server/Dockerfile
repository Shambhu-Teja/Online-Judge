FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

RUN apk add --no-cache \
    python3 \
    g++ \
    openjdk17

COPY . .

RUN npm run build

EXPOSE 5000

CMD ["npm", "start"]
