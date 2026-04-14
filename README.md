# AIstro 2.0

AIstro is a MERN-style astrology app with a React frontend, Express/MongoDB backend, cookie-based authentication, birth detail storage, and Gemini-powered astrology reports and chat.

## Project Structure

- `Frontend/` - Vite React app
- `Backend/` - Express API

## Backend Setup

Create `Backend/.env`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.5-flash-lite
CLIENT_ORIGIN=http://localhost:5173
NODE_ENV=development
```

Run the backend:

```bash
cd Backend
npm install
npm run dev
```

## Frontend Setup

Create `Frontend/.env`:

```env
VITE_API_URL=http://localhost:5000
```

Run the frontend:

```bash
cd Frontend
npm install
npm run dev
```

## Production Notes

- Set `CLIENT_ORIGIN` on the backend to the deployed frontend URL.
- Set `VITE_API_URL` on the frontend to the deployed backend URL.
- Set `NODE_ENV=production` on the backend so cookies use production-safe settings.
- Keep `.env` files private. They should not be committed.
- The backend uses HTTP-only cookies, so CORS origins and cookie settings must match the deployment domains.
- Generated astrology reports are cached per user and birth details. Updating birth details creates a fresh report.
- Chat messages are saved per user and loaded again when the dashboard opens.

## Health Check

The backend exposes:

```bash
GET /health
```

It returns basic API status, database connection status, uptime, and whether the AI key is configured.

## Useful Scripts

Backend:

```bash
npm run dev
```

Frontend:

```bash
npm run dev
npm run build
npm run lint
```
