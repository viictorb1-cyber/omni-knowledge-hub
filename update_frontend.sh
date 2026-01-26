#!/bin/bash

# Configuration
REPO_URL="https://github.com/viictorb1-cyber/omni-knowledge-hub.git"
BUILD_DIR="/tmp/omni_build"
DEPLOY_PATH="/var/www/omni-knowledge-hub"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}Updating Omni Knowledge Hub...${NC}"

# 1. Update Repository
if [ -d "$BUILD_DIR" ]; then
    echo -e "${GREEN}Pulling latest changes...${NC}"
    cd "$BUILD_DIR" || exit
    git pull origin main
else
    echo -e "${GREEN}Cloning repository...${NC}"
    git clone "$REPO_URL" "$BUILD_DIR"
    cd "$BUILD_DIR" || exit
fi

# 2. Rebuild
echo -e "${GREEN}Installing dependencies and building...${NC}"
npm install
npm run build

# 3. Deploy
echo -e "${GREEN}Deploying new version...${NC}"
cp -r dist/* "$DEPLOY_PATH"/
chown -R nginx:nginx "$DEPLOY_PATH"

echo -e "${GREEN}Update Complete!${NC}"
