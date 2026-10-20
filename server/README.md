# Airbnb  - Backend (Server Side)

The backend REST API for the Airbnb Clone, built with **Node.js (ES Modules)**, **Express 5**, and **MongoDB (Mongoose 8)**. It features session-based authentication, CSRF protection, image processing with Sharp/Multer, sample data seeding, and secure RESTful endpoints for listings, reviews, and wishlists.

---

## 🚀 Tech Stack

- **Runtime**: [Node.js](https://nodejs.org/) (ES Modules)
- **Web Framework**: [Express 5](https://expressjs.com/)
- **Database & ODM**: [MongoDB](https://www.mongodb.com/) + [Mongoose 8](https://mongoosejs.com/)
- **Authentication**: [Passport.js](http://www.passportjs.org/) + `passport-local-mongoose`
- **Session Management**: `express-session` with `connect-mongo` (MongoDB session store)
- **Image Processing**: [Sharp](https://sharp.pixelplumbing.com/) (WebP conversion and optimization) + [Multer](https://github.com/expressjs/multer)
- **Validation**: [Joi](https://joi.dev/)
- **Security**: [Helmet](https://helmetjs.github.io/), [express-rate-limit](https://github.com/express-rate-limit/express-rate-limit), double-submit cookie / custom CSRF guard

---

##  Directory Structure

```text
server/
├── public/
│   └── images/               # Default static listing images and uploads
├── scripts/
│   └── seed.js               # Database seeder (creates demo host & sample listings)
├── src/
│   ├── config/
│   │   ├── database.js       # MongoDB connection setup
│   │   └── env.js            # Environment validation & loading
│   ├── controllers/
│   │   ├── authController.js    # Register, login, me, logout handlers
│   │   ├── listingController.js # Listings CRUD, search, filter handlers
│   │   ├── reviewController.js  # Add and delete reviews
│   │   └── savedController.js   # User wishlist (favorites) handlers
│   ├── middleware/
│   │   ├── auth.js           # Authentication guards, ownership verification
│   │   ├── csrf.js           # CSRF token generation and validation
│   │   └── errorHandler.js   # Global error handling and 404 responses
│   ├── models/
│   │   ├── Listing.js        # Listing schema (title, price, category, image, owner)
│   │   ├── Review.js         # Review schema (rating, comment, author)
│   │   └── User.js           # User schema (passport-local-mongoose authentication)
│   ├── routes/
│   │   └── index.js          # API route definitions
│   ├── services/
│   │   └── imageService.js   # Image upload, sharp resizing, and storage logic
│   ├── utils/
│   │   └── ApiError.js       # Custom operational error class
│   ├── validators/
│   │   └── index.js          # Joi schemas for request payload validation
│   ├── app.js                # Express app configuration & middleware pipeline
│   └── server.js             # HTTP server entry point
├── uploads/                  # Local folder for user-uploaded listing images
├── .env                      # Local environment configuration (private)
├── .env.example              # Sample environment configuration template
└── package.json
```

---

## 🗄️ Local MongoDB Setup 

This application connects to a local MongoDB instance running on your machine.

### 1. Verify MongoDB is Running
Make sure MongoDB Community Server is installed and active on your system.

- **Windows**:
  Check if the MongoDB service is running:
  ```powershell
  Get-Service -Name MongoDB
  ```
  If it is stopped, start it:
  ```powershell
  Start-Service -Name MongoDB
  ```
  Or verify port `27017` is listening:
  ```powershell
  Test-NetConnection -ComputerName 127.0.0.1 -Port 27017
  ```

- **macOS (Homebrew)**:
  ```bash
  brew services start mongodb-community
  ```

- **Linux (systemd)**:
  ```bash
  sudo systemctl start mongod
  ```

### 2. Connection String
In your `server/.env`, set:
```env
MONGODB_URI=mongodb://127.0.0.1:27017/airbnb_db
```

---

## ⚙️ Environment Configuration

Create or verify `server/.env` with the following variables:

```env
# MongoDB Connection
MONGODB_URI=

# Session Secret (must be at least 32 characters)
SESSION_SECRET=

# Server Port
PORT=3000

# Frontend URL (Used for CSRF and CORS verification)
APP_ORIGIN=http://localhost:5173

# Optional: Cloudinary credentials (leave blank for local image storage in server/uploads)
CLOUD_NAME=
CLOUD_API_KEY=
CLOUD_API_SECRET=

# Seed Demo Host Account (SEED_PASSWORD must be at least 8 characters)
SEED_USERNAME=demo_host
SEED_EMAIL=host@example.com
SEED_PASSWORD=password123
```

> [!NOTE]
> - `SESSION_SECRET` must be at least **32 characters long** or the server will halt on startup.
> - If Cloudinary variables are left empty, listing image uploads are automatically converted to `.webp` by Sharp and saved to `server/uploads/`.

---

## 📦 Installation

1. **Navigate to the server directory**:
   ```bash
   cd server
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

---

## 🌱 Seeding the Database

Populate your local MongoDB with sample listings and a demo host account:

```bash
npm run seed
```

## 🏃 Running the Server

### Development Mode (with automatic restart)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

Once running, the terminal will display:
```text
API ready at http://localhost:3000
```

To verify the health of the server, open:
`http://localhost:3000/api/health` — should return `{"status":"ok"}`.

---

## 📡 API Reference Overview

All API endpoints are prefixed with `/api`. Responses are in JSON format.

### 🔑 Authentication
| Method | Route | Description |
| :--- | :--- | :--- |
| `GET` | `/api/auth/me` | Fetch current session user & CSRF token |
| `POST` | `/api/auth/signup` | Register a new user and initiate session |
| `POST` | `/api/auth/login` | Log in with credentials and rotate session |
| `POST` | `/api/auth/logout` | Destroy session and log out |

### 🏡 Listings
| Method | Route | Description |
| :--- | :--- | :--- |
| `GET` | `/api/listings` | Get paginated listings (supports `q`, `category`, `sort`, `page`) |
| `GET` | `/api/listings/:id` | Get details for a specific listing |
| `POST` | `/api/listings` | Create a new listing (multipart form with image) [Auth required] |
| `PUT` | `/api/listings/:id` | Update an existing listing [Owner only] |
| `DELETE`| `/api/listings/:id` | Delete a listing and associated reviews [Owner only] |

### ⭐ Reviews & Saved Wishlist
| Method | Route | Description |
| :--- | :--- | :--- |
| `POST` | `/api/listings/:id/reviews` | Submit a review (`rating: 1-5`, `comment`) [Auth required] |
| `DELETE`| `/api/listings/:id/reviews/:reviewId` | Delete a review [Author only] |
| `GET` | `/api/saved` | Get user's saved wishlist items [Auth required] |
| `PUT` | `/api/saved/:id` | Add listing to saved favorites [Auth required] |
| `DELETE`| `/api/saved/:id` | Remove listing from saved favorites [Auth required] |

---
