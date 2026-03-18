# Vayu (Frontend)

Vayu is a Next.js (App Router) frontend for searching real-time weather and air-quality data.

## Tech stack

- **Framework**: Next.js (App Router)
- **Runtime / package manager**: Bun
- **Data fetching**: SWR + Axios
- **Styling**: Tailwind CSS (utility classes)

## Requirements

- **Bun** installed (`bun --version`)
- A running backend that exposes the weather API used by this frontend

## Environment variables

Create `.env.local` in the project root:

```bash
NEXT_PUBLIC_BACKEND_URL="http://localhost:YOUR_BACKEND_PORT"
```

Notes:
- The variable is prefixed with `NEXT_PUBLIC_` because it’s used in the browser.

## Run locally

Install dependencies:

```bash
bun install
```

Start the dev server:

```bash
bun run dev
```

Open `http://localhost:3000`.

## Scripts

```bash
bun run dev     # start dev server
bun run build   # production build
bun run start   # start production server
```

## Routes

- **`/`**: landing page
- **`/home`**: search UI + popular cities + recent searches
- **`/weather?city=...`**: weather + air quality for a city

## Production / deployment

Build the app:

```bash
bun run build
```

Deploy anywhere that supports Next.js. If deploying to Vercel, set the same `NEXT_PUBLIC_BACKEND_URL` environment variable in your project settings.
