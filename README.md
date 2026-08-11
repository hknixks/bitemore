# BiteMore

An online food ordering web app. Users can browse a menu, add items to a cart, check out, and track order history; admins can manage the menu and incoming orders.

**Live app:** [bitemore-chi.vercel.app](https://bitemore-chi.vercel.app)
**API:** [bitemore-backend.onrender.com/api/v1](https://bitemore-backend.onrender.com/api/v1)
**Repo:** [github.com/hknixks/bitemore](https://github.com/hknixks/bitemore)

## Stack

- **Frontend:** React + Vite, Redux Toolkit, Material Tailwind / MUI, deployed on Vercel
- **Backend:** Node.js + Express, MongoDB (Mongoose), deployed on Render
- **Other services:** Cloudinary (image uploads), Nodemailer (password reset emails), Paystack (payments)

## Project structure

```
frontend/   React app (Vite)
backend/    Express API + MongoDB models
```

## Running locally

### Backend

```bash
cd backend
npm install
```

Create a `backend/.env` file with:

```
MONGO_URI=<your MongoDB connection string>
PORT=4000
PASS=<email app password, for password-reset emails>
MAIL=<sender email address>
SECRET=<JWT secret>
cloud_name=<Cloudinary cloud name>
api_key=<Cloudinary API key>
api_secret=<Cloudinary API secret>
```

```bash
npm start
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend expects the API at `http://localhost:4000/api/v1` in development (see `src/BaseUrl.jsx`).

## Deployment

- **Backend** is deployed to Render as a web service (root directory `backend`, build `npm install`, start `npm start`). Node is pinned to v20 via `.node-version` — newer Node versions break a legacy dependency of `jsonwebtoken`.
- **Frontend** is deployed to Vercel (root directory `frontend`, framework Vite). `vercel.json` rewrites all routes to `index.html` for client-side routing.
- Environment variables for the backend are set directly in the Render dashboard, not committed to the repo.
