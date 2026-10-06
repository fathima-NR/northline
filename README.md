# northline

Northline is an online shop for bags, audio, watches, cameras, and home accessories.

The storefront is an Angular app. The API is Express and MongoDB. Sign in locally with `demo@famsworld.com` / `demo123` after the database is seeded.

## Run locally

```bash
npm install
npm install --prefix server
npm install --prefix client
npm run dev
```

The shop runs at http://127.0.0.1:4280 and the API at http://127.0.0.1:5050. Copy `server/.env.example` to `server/.env` and set `MONGO_URI`. If MongoDB is not running, the API falls back to an in-memory database that resets when the process stops.

## Deploy

- Storefront: Vercel, from this repository. Requests to `/api` are rewritten to the Render service.
- API: Render web service `northline-api` (free). Set `MONGO_URI` to a MongoDB Atlas connection string and `CLIENT_ORIGIN` to the Vercel URL.
- Database: MongoDB Atlas. Use the connection string as `MONGO_URI`. Do not commit `server/.env`.
