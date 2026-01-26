#!/bin/bash

# Config
DB_NAME="omni_knowledge_db"
DB_USER="omni_user"
DB_PASS="Omni@Secure2026" # Change this in production!
PG_VERSION="13"

# Colors
GREEN='\033[0;32m'
NC='\033[0m'

echo -e "${GREEN}Installing PostgreSQL $PG_VERSION on Rocky Linux 8...${NC}"

# 1. Install PostgreSQL Repository
sudo dnf install -y https://download.postgresql.org/pub/repos/yum/reporpms/EL-8-x86_64/pgdg-redhat-repo-latest.noarch.rpm

# 2. Disable default postgres module
sudo dnf -qy module disable postgresql

# 3. Install PostgreSQL Server
sudo dnf install -y postgresql${PG_VERSION}-server

# 4. Initialize Database
sudo /usr/pgsql-${PG_VERSION}/bin/postgresql-${PG_VERSION}-setup initdb

# 5. Enable and Start Service
sudo systemctl enable postgresql-${PG_VERSION}
sudo systemctl start postgresql-${PG_VERSION}

# 6. Configure Authentication (Allow password auth for local connections)
PG_HBA="/var/lib/pgsql/${PG_VERSION}/data/pg_hba.conf"
# Backup
sudo cp $PG_HBA "${PG_HBA}.bak"
# Change 'ident' to 'md5' or 'scram-sha-256' for local connections
sudo sed -i 's/ident/md5/g' $PG_HBA
sudo sed -i 's/peer/md5/g' $PG_HBA

# Reload configuration
sudo systemctl reload postgresql-${PG_VERSION}

# 7. Create Database and User
echo -e "${GREEN}Creating Database and User...${NC}"

sudo -u postgres psql -c "CREATE USER $DB_USER WITH PASSWORD '$DB_PASS';"
sudo -u postgres psql -c "CREATE DATABASE $DB_NAME OWNER $DB_USER;"

echo -e "${GREEN}Installation and Setup Complete!${NC}"
echo "Database: $DB_NAME"
echo "User: $DB_USER"
echo "Password: $DB_PASS"
