FROM node:latest as node
WORKDIR ./
COPY . .
RUN npm install --force
RUN node server.js
# RUN npm run build --prod

#stage 2
FROM nginx:alpine
# COPY --from=node /app/dist/atlas-eos /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/dist/atlas-eos /usr/share/nginx/html

# start the server
# ENTRYPOINT ["index.html"]
ENTRYPOINT ["nginx", "-g", "daemon off;"]
