FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:1.27-alpine
ARG LP_APP_ID=all
COPY deploy/easypanel/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/apps/${LP_APP_ID}/ /usr/share/nginx/html/
EXPOSE 80
