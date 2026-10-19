# Airbnb Fullstack Web Application

A full-stack Airbnb clone featuring an interactive **React 19 + Tailwind CSS + Vite** frontend and an **Express 5 + MongoDB** backend.

---

## 🏗️ Architecture

- **Frontend (`/client`)**: React 19, Tailwind CSS v4, React Router v7, Lucide Icons, Vite 8 dev server with automated proxying.
- **Backend (`/server`)**: Node.js (ES Modules), Express 5, Mongoose 8, Passport.js authentication, persistent session cookies via MongoDB, Sharp image optimization, CSRF & Helmet security guards.
- **Database**: Local MongoDB Community Server running on `127.0.0.1:27017` (No Docker required).

---

## ⚡ Quick Start Guide

### 1. Ensure Local MongoDB is Running
Make sure your local MongoDB service is running on your machine:
```powershell
# Windows
Get-Service -Name MongoDB
```
*(Port: `127.0.0.1:27017`)*

---

### 2. Setup and Start the Backend Server

```bash
cd server
npm install
npm run seed       # Seeds demo host and sample listings
npm run dev        # Starts backend API on http://localhost:3000
```

> For full backend documentation, configuration, and API reference, see [server/README.md](server/README.md).

---

### 3. Setup and Start the Frontend Client

Open a second terminal window:

```bash
cd client
npm install
npm run dev        # Starts Vite dev server on http://localhost:5173
```

> For full frontend documentation and UI details, see [client/README.md](client/README.md).

---

### 4. Open in Your Browser

Visit **`http://localhost:5173`** to use the application:
- **Browse & Search**: Explore sample stays, filter by categories (Cabins, Mountains, Beachfront, etc.).
- **Log In**: Use demo account `demo_host` with password `password123` (or create your own account via Sign Up).
- **Host Stays**: Create, edit, and delete your listings with local image uploads.
- **Wishlist & Reviews**: Save listings to your favorites and submit ratings with comments.

---

## 📚 Project Documentation

- **[Client Documentation (`client/README.md`)](client/README.md)**: Setup, component breakdown, styling, and Vite dev proxy.
- **[Server Documentation (`server/README.md`)](server/README.md)**: Local MongoDB setup, environment variables, authentication, API routes, and seeding.
- **[API Reference (`API.md`)](API.md)**: Detailed JSON contract and payload specifications.
