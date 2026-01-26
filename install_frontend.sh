#!/bin/bash

# Configuration
REPO_URL="https://github.com/viictorb1-cyber/omni-knowledge-hub.git"
SERVER_NAME="_"
# Directory where the project will be cloned/built
BUILD_DIR="/tmp/omni_build"
# Directory where the compiled frontend will be served from
DEPLOY_PATH="/var/www/omni-knowledge-hub"
NGINX_CONF="/etc/nginx/conf.d/omni-knowledge-hub.conf"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}Starting full installation for Omni Knowledge Hub (Frontend) on Rocky Linux 8...${NC}"

# Check for root privileges
if [ "$EUID" -ne 0 ]; then
  echo -e "${RED}Please run as root (sudo ./install_frontend.sh)${NC}"
  exit 1
fi

# 1. Update System and Install Git
echo -e "${GREEN}[1/8] Updating system and installing Git...${NC}"
dnf update -y
dnf install git -y

# 2. Install Node.js
# Using dnf module to install Node.js 20
echo -e "${GREEN}[2/8] Installing Node.js 20...${NC}"
dnf module reset nodejs -y
dnf module enable nodejs:20 -y
dnf install nodejs -y

# Verify Node installation
echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"

# 3. Install Nginx
echo -e "${GREEN}[3/8] Installing Nginx...${NC}"
dnf install nginx -y

# 4. Clone Repository
echo -e "${GREEN}[4/8] Cloning repository...${NC}"
rm -rf "$BUILD_DIR"
git clone "$REPO_URL" "$BUILD_DIR"

if [ ! -d "$BUILD_DIR" ]; then
    echo -e "${RED}Failed to clone repository.${NC}"
    exit 1
fi

# 5. Install Dependencies & Build
echo -e "${GREEN}[5/8] Installing dependencies and building...${NC}"
cd "$BUILD_DIR" || exit
npm install
npm run build

DIST_DIR="$BUILD_DIR/dist"
if [ ! -d "$DIST_DIR" ]; then
    echo -e "${RED}Build failed! Directory $DIST_DIR not found.${NC}"
    exit 1
fi

# 6. Deploy Files
echo -e "${GREEN}[6/8] Deploying to $DEPLOY_PATH...${NC}"
mkdir -p "$DEPLOY_PATH"
# Clean old files if they exist
rm -rf "$DEPLOY_PATH"/*
# Copy new build files
cp -r "$DIST_DIR"/* "$DEPLOY_PATH"/

# Set permissions
chown -R nginx:nginx "$DEPLOY_PATH"
chmod -R 755 "$DEPLOY_PATH"
# SELinux context
chcon -R -t httpd_sys_content_t "$DEPLOY_PATH"

# 7. Configure Nginx
echo -e "${GREEN}[7/8] Configuring Nginx...${NC}"

# Backup main nginx.conf
cp /etc/nginx/nginx.conf /etc/nginx/nginx.conf.bak

# Create a clean nginx.conf that only includes conf.d files and basic settings
# This ensures the default server block (usually inside nginx.conf on RHEL/Rocky) doesn't conflict
cat > /etc/nginx/nginx.conf <<EOF
user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log;
pid /run/nginx.pid;

include /usr/share/nginx/modules/*.conf;

events {
    worker_connections 1024;
}

http {
    log_format  main  '\$remote_addr - \$remote_user [\$time_local] "\$request" '
                      '\$status \$body_bytes_sent "\$http_referer" '
                      '"\$http_user_agent" "\$http_x_forwarded_for"';

    access_log  /var/log/nginx/access.log  main;

    sendfile            on;
    tcp_nopush          on;
    tcp_nodelay         on;
    keepalive_timeout   65;
    types_hash_max_size 2048;

    include             /etc/nginx/mime.types;
    default_type        application/octet-stream;

    # Load modular configuration files from the /etc/nginx/conf.d directory.
    # See http://nginx.org/en/docs/ngx_core_module.html#include
    # for more information.
    include /etc/nginx/conf.d/*.conf;
}
EOF

# Create the app specific config
cat > "$NGINX_CONF" <<EOF
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name $SERVER_NAME;

    root $DEPLOY_PATH;
    index index.html;

    # Handle React Router (SPA)
    location / {
        try_files \$uri \$uri/ /index.html;
    }

    # Cache static assets
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, no-transform";
    }

    # Error pages
    error_page 500 502 503 504 /50x.html;
    location = /50x.html {
        root /usr/share/nginx/html;
    }
}
EOF

# Test Nginx configuration
nginx -t

# 8. Start Services and Firewall
echo -e "${GREEN}[8/8] Starting Services & Firewall...${NC}"
systemctl enable nginx
systemctl restart nginx

# Configure Firewall to allow HTTP traffic
if command -v firewall-cmd &> /dev/null; then
    echo "Opening firewall ports..."
    firewall-cmd --permanent --add-service=http
    firewall-cmd --permanent --add-service=https
    firewall-cmd --reload
else
    echo "firewall-cmd not found, checking if using another firewall manager or skipping."
fi

echo -e "${GREEN}Installation Complete!${NC}"
echo -e "Application deployed from $REPO_URL"
echo -e "Access it at http://<YOUR_SERVER_IP>"
