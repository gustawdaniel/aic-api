FROM node:16-alpine

WORKDIR /opt/app

COPY ./package.json ./package-lock.json ./
RUN npm ci
COPY ./ .
RUN npx prisma generate
RUN npm run build
