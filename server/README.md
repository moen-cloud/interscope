# Interscope Server — No Prisma, Pure pg

This server uses the `pg` package directly — no Prisma, no binary issues, works on Render perfectly.

## Local Setup

```bash
npm install
cp .env.example .env
# Edit .env and paste your CockroachDB connection string
npm run dev
```

Test: http://localhost:5000/api/health

## Render Deployment

### Environment Variables (add in Render dashboard):
| Key | Value |
|-----|-------|
| DATABASE_URL | your CockroachDB connection string |
| PORT | 5000 |
| NODE_ENV | production |

### Build Command:
```
npm install
```

### Start Command:
```
node server.js
```

Tables are created automatically on first startup — no migration step needed.

## API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/contact | Save contact form |
| GET  | /api/contact | List all messages |
| POST | /api/leads | Save lead |
| GET  | /api/leads | List all leads |
| POST | /api/trial | Save trial request |
| GET  | /api/health | Health check |
