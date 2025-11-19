############################
# 1. BUILD STAGE
############################
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --silent

COPY . .
RUN npm run build


############################
# 2. PRODUCTION STAGE
############################
FROM nginx:alpine

# Show Vite project in container
WORKDIR /app
COPY . .

# Copy built frontend
COPY --from=builder /app/dist /usr/share/nginx/html


############################
# NGINX CONFIG (NO ERROR)
############################
RUN cat << 'EOF' > /etc/nginx/conf.d/default.conf
server {
    listen 80;
    server_name _;

    root /usr/share/nginx/html;
    index index.html;

    location /env.js {
        add_header Content-Type application/javascript;
        try_files $uri =404;
    }

    location / {
        try_files $uri $uri/ /index.html;
    }
}
EOF


############################
# ENTRYPOINT SCRIPT (NO ERROR)
############################
RUN cat << 'EOF' > /entrypoint.sh
#!/bin/sh

echo "Generating env.js ..."

{
  echo "window.__ENV__ = {"
  env | grep "^VITE_" | while IFS='=' read -r key value; do
    echo "  $key: \"$value\","
  done
  echo "};"
} > /usr/share/nginx/html/env.js

exec "$@"
EOF

RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
