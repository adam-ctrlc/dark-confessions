# Dark Confessions

An anonymous confession platform where anyone can submit and browse confessions without creating an account. Built with SvelteKit, Svelte 5, Tailwind CSS v4, and SQLite.

## Features

- Submit confessions anonymously with an optional title
- Browse confessions in a two-column paginated feed
- Search across all confessions (title and body) via SQL LIKE queries
- Sort by newest or oldest
- View individual confessions at `/:uuid`
- Three reading themes: Light, Dark, Tea (slate)
- Times New Roman serif typography throughout
- Honeypot bot protection on the submission form
- Font Awesome SVG icons via `@fortawesome/svelte-fontawesome`
- Fully responsive layout

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | SvelteKit 2 + Svelte 5 (runes) |
| Styling | Tailwind CSS v4 |
| Database | SQLite via better-sqlite3 |
| ORM | Drizzle ORM |
| Icons | Font Awesome 7 (SVG) |
| Runtime | Node.js 24 |

## Prerequisites

- Node.js 20+
- pnpm

## Getting Started

```bash
# Install dependencies
pnpm install

# Copy the environment file and adjust if needed
cp .env.example .env

# Push the database schema
DATABASE_URL=local.db node node_modules/drizzle-kit/bin.cjs push

# Start the development server
pnpm dev
```

The app will be available at `http://localhost:5173`.

## Environment Variables

| Variable | Description | Default |
|---|---|---|
| `DATABASE_URL` | Path to the SQLite database file | `local.db` |

## Project Structure

```
src/
  lib/
    components/
      ConfessionCard.svelte   # Clickable card linking to /:id
    server/
      db/
        index.ts              # Drizzle client
        schema.ts             # confessions table definition
  routes/
    +layout.svelte            # Root layout with CSS import
    +page.server.ts           # Load (search/sort/paginate) + form action
    +page.svelte              # Feed page with submission form
    [id]/
      +page.server.ts         # Single confession loader
      +page.svelte            # Detail page
    layout.css                # Tailwind import + theme variants + bg pattern
```

## Available Scripts

```bash
pnpm dev          # Start development server
pnpm build        # Production build
pnpm preview      # Preview production build
pnpm check        # Run svelte-check type checking
pnpm db:push      # Push schema changes to the database
pnpm db:studio    # Open Drizzle Studio
```

## Database Schema

```sql
CREATE TABLE confessions (
  id         TEXT    PRIMARY KEY NOT NULL,  -- UUID v4
  title      TEXT,                          -- optional
  body       TEXT    NOT NULL,
  created_at INTEGER NOT NULL DEFAULT (unixepoch())
);
```

## License

Apache License 2.0. Copyright 2026 adam-ctrlc. See [LICENSE](./LICENSE) for details.
