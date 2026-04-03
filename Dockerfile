# Stage 1: build
FROM node:20-alpine AS builder

WORKDIR /app

# 👇 truyền env vào Docker
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_PROVINCE_API_URL

ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_PROVINCE_API_URL=$NEXT_PUBLIC_PROVINCE_API_URL

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

# Stage 2
FROM node:20-alpine

WORKDIR /app
COPY --from=builder /app ./

EXPOSE 3000

CMD ["npm", "start"]