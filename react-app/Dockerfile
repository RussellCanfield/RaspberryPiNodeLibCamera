FROM arm32v7/node:16-alpine3.16 as build
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

FROM nginx:1.23.1-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY --from=build /app/nginx/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]