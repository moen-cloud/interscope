# Interscope — PostgreSQL Backend (Replaces MongoDB)

Drop this `server/` folder into your existing interscope project,
replacing the old MongoDB server folder entirely.

## Setup Steps

### Step 1 — Install dependencies
```bash
cd server
npm install
```

### Step 2 — Create the .env file
```bash
cp .env.example .env
```

Then open `.env` and fill in your PostgreSQL password:
```
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD_HERE@localhost:5432/interscope"
PORT=5000
```

> Your PostgreSQL username is usually `postgres` and the password is
> what you set during installation. The database `interscope` will be
> created automatically in the next step.

### Step 3 — Create the database in PostgreSQL
Open pgAdmin (or psql) and run:
```sql
CREATE DATABASE interscope;
```

Or using psql in terminal:
```bash
psql -U postgres -c "CREATE DATABASE interscope;"
```

### Step 4 — Run Prisma migrations (creates the tables)
```bash
npm run db:setup
```

This creates 3 tables automatically:
- `leads` — stores consultation, whitepaper, trial signups
- `contacts` — stores contact form messages  
- `trials` — stores free trial requests

### Step 5 — Generate Prisma client
```bash
npm run db:generate
```

### Step 6 — Start the server
```bash
npm run dev
```

You should see:
```
[Interscope] 🚀 Server running on http://localhost:5000
[Interscope] 🗄️  Database: PostgreSQL via Prisma
```

### Step 7 — Test it's working
Open: http://localhost:5000/api/health

You should see:
```json
{ "status": "ok", "database": "postgresql — connected ✅" }
```

---

## Useful Commands

| Command | What it does |
|---------|-------------|
| `npm run dev` | Start server with auto-reload |
| `npm run db:setup` | Create/update database tables |
| `npm run db:studio` | Open Prisma Studio (visual DB browser) |
| `npm run db:generate` | Regenerate Prisma client after schema changes |

## Prisma Studio (Visual Database Viewer)
```bash
npm run db:studio
```
Opens a browser UI at http://localhost:5555 where you can see
and edit all your leads, contacts, and trials visually — completely free!

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/contact | Save contact form message |
| GET  | /api/contact | List all contact messages |
| POST | /api/leads | Save lead (consultation/whitepaper) |
| GET  | /api/leads | List all leads |
| POST | /api/trial | Save free trial request |
| GET  | /api/health | Health check + DB status |
