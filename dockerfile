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

WORKDIR /app
COPY . .

# Copy built frontend
COPY --from=builder /app/dist /usr/share/nginx/html

############################
# NGINX CONFIG (COOLIFY SAFE)
############################
RUN <<EOF
cat > /etc/nginx/conf.d/default.conf <<'CONF'
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
CONF
EOF


############################
# ENTRYPOINT SCRIPT (COOLIFY SAFE)
############################
RUN <<EOF
cat > /entrypoint.sh <<'SCRIPT'
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
SCRIPT
EOF

RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
