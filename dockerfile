############################
# 1. Build Stage
############################
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --silent

COPY . .
RUN npm run build


############################
# 2. Production Stage
############################
FROM nginx:alpine

# Create /app directory and copy source code
WORKDIR /app
COPY . .

# Copy built output to nginx folder
COPY --from=builder /app/dist /usr/share/nginx/html


############################
# Create nginx configuration (inline)
############################
RUN echo 'server { \
    listen 80; \
    listen [::]:80; \
    server_name _; \
    root /usr/share/nginx/html; \
    index index.html; \
    \
    location /env.js { \
        add_header Content-Type application/javascript; \
        try_files $uri =404; \
    } \
    \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf


############################
# env.js runtime generator
############################
RUN echo '#!/bin/sh \
echo "window.__ENV__ = {" > /usr/share/nginx/html/env.js; \
env | grep "^VITE_" | while read -r line; do \
  key=$(echo $line | cut -d "=" -f 1); \
  value=$(echo $line | cut -d "=" -f 2-); \
  echo "  $key: \"$value\"," >> /usr/share/nginx/html/env.js; \
done; \
echo "};" >> /usr/share/nginx/html/env.js; \
exec "$@"' > /entrypoint.sh

RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
