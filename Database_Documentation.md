# Database Documentation & Credentials

## 1. Credentials
* **Database Name**: `omni_knowledge_db`
* **Username**: `omni_user`
* **Password**: `Omni@Secure2026`
* **Host**: `localhost` (Internal connection)
* **Port**: `5432`

> **Note**: These credentials are defined in `install_db.sh`. If you change them there, update them here.

## 2. Installation Instructions (Rocky Linux 8)

1. **Upload Scripts**: Copy `install_db.sh` and `setup_db.sql` to your server.
2. **Run Installer**:
   ```bash
   chmod +x install_db.sh
   sudo ./install_db.sh
   ```
3. **Initialize Schema**:
   After installation, populate the tables:
   ```bash
   export PGPASSWORD='Omni@Secure2026'
   psql -h localhost -U omni_user -d omni_knowledge_db -f setup_db.sql
   ```

## 3. Database Schema

### `folders` table
Stores the main categories/folders.
- `id`: UUID (Primary Key)
- `name`: Category name
- `category`: 'pabx' or 'omni'

### `articles` table
Stores the help articles.
- `id`: UUID (Primary Key)
- `folder_id`: Link to parent folder
- `title`: Article title
- `content`: Article HTML content
- `category`: 'pabx' or 'omni'

### `article_images` table
Stores images separately.
- `id`: UUID
- `article_id`: Link to article
- `url`: Path to image or Base64 string

### `article_videos` table
Stores videos separately.
- `id`: UUID
- `article_id`: Link to article
- `url`: Path to video or Base64 string
