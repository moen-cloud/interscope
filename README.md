# INTERSCOPE TECHNOLOGIES — MERN Stack

A full MERN stack conversion of the original Next.js/TypeScript cybersecurity website.

## Project Structure

```
interscope/
├── client/          ← React + Vite + Tailwind (JSX)
│   ├── src/
│   │   ├── components/   ← All UI components (JSX)
│   │   ├── lib/          ← Utilities
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
├── server/          ← Express + MongoDB backend
│   ├── models/
│   │   ├── Lead.js
│   │   └── Contact.js
│   ├── routes/
│   │   ├── leads.js
│   │   ├── contact.js
│   │   └── trial.js
│   ├── server.js
│   └── .env.example
└── package.json
```

## Prerequisites

- Node.js 18+
- MongoDB running locally (`mongod`)

## Quick Start

### Step 1 — Install dependencies

```bash
# Install client deps
cd client && npm install

# Install server deps
cd ../server && npm install
```

### Step 2 — Configure environment

```bash
cd server
cp .env.example .env
# Edit .env if needed (default: mongodb://localhost:27017/interscope)
```

### Step 3 — Start MongoDB

```bash
# macOS/Linux
mongod

# Or with brew
brew services start mongodb-community
```

### Step 4 — Run the app (two terminals)

**Terminal 1 — Backend:**
```bash
cd server
npm run dev
# Runs on http://localhost:5000
```

**Terminal 2 — Frontend:**
```bash
cd client
npm run dev
# Runs on http://localhost:3000
```

Open http://localhost:3000

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/contact | Submit contact form (saved to MongoDB) |
| GET  | /api/contact | List all contact messages |
| POST | /api/leads | Capture a lead (consultation/whitepaper) |
| GET  | /api/leads | List all leads |
| POST | /api/trial | Submit free trial request |
| GET  | /api/health | Server health check |

## What Changed from Next.js → MERN

| Before (Next.js/TSX) | After (MERN/JSX) |
|---------------------|------------------|
| `.tsx` files | `.jsx` files |
| TypeScript types | Plain JavaScript |
| `next/link` | `<a>` tags / scroll handlers |
| `next/navigation` (useRouter) | Removed (single-page) |
| Next.js API routes | Express.js routes |
| `next-themes` | Custom ThemeToggle |
| `"use client"` directives | Removed (not needed) |
| Vercel Analytics | Removed |
| `@vercel/analytics` | Removed |

## MongoDB Data

Leads and contact messages are stored in the `interscope` database:
- `leads` collection — from trial, consultation, whitepaper, payment
- `contacts` collection — from the contact form
