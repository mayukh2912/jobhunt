# JobHunt — Job Posts Admin Page (MERN)

One frontend page, matching the Figma design, that fetches job posts from a
backend and supports:

- **List / fetch** job posts from the API (Job Title, Designation, Salary,
  Category, Job Type, Location, Deadline — matching the Figma table)
- **Search** across title, designation, category, and location (debounced,
  hits the backend `?search=` query)
- **Activate / Deactivate** a job post via a toggle switch
- **Edit** a job post's details in a modal
- **Add/Post a Job** and **Delete** (bonus, matching the Figma's action links)
- **Pagination** footer (Jump to page, numbered pages, Next »)

## Stack

- **Backend:** Node.js + Express + Mongoose (`server/`)
- **Frontend:** React + Vite (`client/`)
- **Database:** MongoDB if `MONGO_URI` is set, otherwise the server runs on
  built-in in-memory demo data automatically — no DB setup needed to try it out.

## Run it

**1. Backend**

```bash
cd server
npm install
npm start
```

Runs on `http://localhost:5000`. This is an API only — visiting it directly
in a browser will show "Cannot GET /", which is expected. To use real
MongoDB, copy `.env.example` to `.env` and set `MONGO_URI`; otherwise it uses
in-memory demo data (8 sample job posts for Reboot AI).

**2. Frontend**

```bash
cd client
npm install
npm run dev
```

Runs on `http://localhost:5173` — **this is the actual page to open in your
browser.** It proxies `/api` requests to the backend automatically.

> Note for Windows PowerShell users: run each command (`cd server`, `npm
> install`, `npm start`) on its own line rather than chaining with `&&`.

## API endpoints

| Method | Route                  | Purpose                          |
|--------|------------------------|-----------------------------------|
| GET    | `/api/jobs?search=`    | List jobs, optional search filter |
| POST   | `/api/jobs`            | Create a job post                 |
| PUT    | `/api/jobs/:id`        | Edit a job post                   |
| PATCH  | `/api/jobs/:id/toggle` | Activate/deactivate a job post    |
| DELETE | `/api/jobs/:id`        | Remove a job post                 |

## Notes

- Toggling and deleting are optimistic in the UI (update instantly, roll
  back on error).
- Search re-queries the backend rather than filtering only on the client, so
  it demonstrates the search endpoint actually working end-to-end.
- Swapping from demo mode to real MongoDB requires no frontend changes —
  only setting `MONGO_URI` in `server/.env`.
- Frontend layout (logo, nav, table columns, action links, toggle, pagination)
  was built to match the provided Figma reference.
