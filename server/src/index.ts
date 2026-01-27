import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import { query } from './db';
import fs from 'fs';

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../public/uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// --- Routes ---

// 1. Folders
app.get('/api/folders', async (req, res) => {
    try {
        const { category } = req.query;
        let sql = 'SELECT * FROM folders';
        const params: any[] = [];

        if (category) {
            sql += ' WHERE category = $1';
            params.push(category);
        }

        sql += ' ORDER BY name ASC';
        const result = await query(sql, params);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/folders', async (req, res) => {
    try {
        const { name, category } = req.body;
        const result = await query(
            'INSERT INTO folders (id, name, category) VALUES (gen_random_uuid(), $1, $2) RETURNING *',
            [name, category]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.delete('/api/folders/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await query('DELETE FROM folders WHERE id = $1', [id]);
        res.status(204).send();
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// 2. Articles
app.get('/api/articles', async (req, res) => {
    try {
        const { folderId, category } = req.query;
        let sql = `
      SELECT a.*, 
             COALESCE(json_agg(DISTINCT ai.url) FILTER (WHERE ai.url IS NOT NULL), '[]') as images,
             COALESCE(json_agg(DISTINCT av.url) FILTER (WHERE av.url IS NOT NULL), '[]') as videos
      FROM articles a
      LEFT JOIN article_images ai ON a.id = ai.article_id
      LEFT JOIN article_videos av ON a.id = av.article_id
    `;
        const params: any[] = [];
        const conditions: string[] = [];

        if (folderId) {
            conditions.push(`a.folder_id = $${params.length + 1}`);
            params.push(folderId);
        }
        if (category) {
            conditions.push(`a.category = $${params.length + 1}`);
            params.push(category);
        }

        if (conditions.length > 0) {
            sql += ' WHERE ' + conditions.join(' AND ');
        }

        sql += ' GROUP BY a.id ORDER BY a.created_at DESC';

        const result = await query(sql, params);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/articles', async (req, res) => {
    const client = await import('./db').then(m => m.getClient());
    try {
        await client.query('BEGIN');
        const { folderId, title, content, category, images, videos } = req.body;

        const articleRes = await client.query(
            'INSERT INTO articles (id, folder_id, title, content, category) VALUES (gen_random_uuid(), $1, $2, $3, $4) RETURNING *',
            [folderId, title, content, category]
        );
        const article = articleRes.rows[0];

        if (images && images.length > 0) {
            for (const img of images) {
                await client.query('INSERT INTO article_images (id, article_id, url) VALUES (gen_random_uuid(), $1, $2)', [article.id, img]);
            }
        }

        if (videos && videos.length > 0) {
            for (const vid of videos) {
                await client.query('INSERT INTO article_videos (id, article_id, url) VALUES (gen_random_uuid(), $1, $2)', [article.id, vid]);
            }
        }

        await client.query('COMMIT');

        // Return complete object
        article.images = images || [];
        article.videos = videos || [];
        res.status(201).json(article);
    } catch (err) {
        await client.query('ROLLBACK');
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        client.release();
    }
});

app.put('/api/articles/:id', async (req, res) => {
    // Simplified update - normally would handle diffing images/videos
    // For now, let's assume update just updates content details
    // A robust impl would delete old media relations and add new ones or diff them.
    try {
        const { id } = req.params;
        const { title, content } = req.body;
        const result = await query(
            'UPDATE articles SET title = $1, content = $2, updated_at = NOW() WHERE id = $3 RETURNING *',
            [title, content, id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.delete('/api/articles/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await query('DELETE FROM articles WHERE id = $1', [id]);
        res.status(204).send();
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Upload Endpoint
app.post('/api/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    // Return the path that helps frontend display it.
    // Assuming server is serving 'uploads' statically under /uploads
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    res.json({ url: fileUrl });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
