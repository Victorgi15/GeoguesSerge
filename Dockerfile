FROM nginx:alpine

RUN cat <<'EOF' > /etc/nginx/conf.d/default.conf
server {
  listen 3000;
  server_name _;
  root /usr/share/nginx/html;
  index index.html;

  location / {
    try_files $uri /index.html;
  }
}
EOF

COPY index.html /usr/share/nginx/html/
COPY *.js /usr/share/nginx/html/
COPY *.css /usr/share/nginx/html/

EXPOSE 3000
