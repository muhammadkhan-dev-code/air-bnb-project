# Airbnb Clone - Frontend (Client)

A modern, responsive Airbnb clone built with **React 19**, **Vite**, **Tailwind CSS v4**, and **React Router v7**. It features full listing discovery, category filtering, search, interactive property details, user authentication, review submissions, and personal saved collections.

---

## 🚀 Tech Stack

- **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Routing**: [React Router DOM v7](https://reactrouter.com/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **State & Context**: Native React Context (`AuthContext`, `ToastContext`, `SavedContext`)
- **API Client**: Native `fetch` with CSRF protection and automatic credentials handling

---

## 📁 Directory Structure

```text
client/
├── public/
│   └── images/               # Static icons, brand logo (Logo.svg), fallback images
├── src/
│   ├── assets/               # Static assets & SVG icons
│   ├── components/
│   │   ├── layout/           # Navbar, Footer, Logo, ProtectedRoute, ScrollToTop
│   │   ├── listings/         # PropertyCard, ListingForm, SaveButton, FilterBar
│   │   └── ui/               # Reusable UI components (Buttons, Inputs, Modal, Toast)
│   ├── context/              # AuthContext, ToastContext, SavedContext
│   ├── hooks/                # Custom React hooks
│   ├── pages/
│   │   ├── Home.jsx          # Discovery, category filter, and search
│   │   ├── ListingDetailsPage.jsx  # Individual stay details, reviews, author info
│   │   ├── ListingEditorPage.jsx   # Create & Edit listing forms
│   │   ├── SavedPage.jsx     # User wishlist / saved favorites
│   │   ├── AuthPage.jsx      # Login and signup screens
│   │   └── NotFound.jsx      # 404 page
│   ├── services/
│   │   ├── api.js            # Base fetch wrapper with CSRF token management
│   │   ├── authApi.js        # Authentication endpoints (/api/auth/*)
│   │   ├── listingApi.js     # Listings CRUD endpoints (/api/listings/*)
│   │   └── savedApi.js       # Favorites endpoints (/api/saved/*)
│   ├── utils/                # Styles, constants, formatters
│   ├── App.jsx               # Main application routing
│   ├── index.css             # Tailwind CSS tokens, theme colors & base styles
│   └── main.jsx              # React DOM entry point with Providers
├── vite.config.js            # Vite configuration with API dev proxy
└── package.json
```

---

## 🛠️ Prerequisites

- **Node.js**: `v20.x` or `v22.x` (or newer)
- **npm**: `v10.x` or newer
- **Backend**: Express server running on `http://localhost:3000` (see `../server/README.md`)

---

## ⚙️ Installation & Setup

1. **Navigate to the client directory**:
   ```bash
   cd client
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

---

## 🏃 Running in Development

Start the Vite development server:

```bash
npm run dev
```

- Local URL: **`http://localhost:5173`**
- Network access: Use `npm run dev -- --host` if testing across local devices.

### 🔄 How the Dev Server Communicates with Backend

`vite.config.js` is pre-configured with a reverse proxy so you don't face CORS or cookie credential issues:

```javascript
server: {
  port: 5173,
  proxy: {
    "/api": {
      target: "http://localhost:3000",
      changeOrigin: true,
    },
    "/uploads": {
      target: "http://localhost:3000",
      changeOrigin: true,
    },
    "/images": {
      target: "http://localhost:3000",
      changeOrigin: true,
    },
  },
}
```

- Any request to `/api/*` is seamlessly forwarded to `http://localhost:3000/api/*`.
- Uploaded listing images (`/uploads/*`) and legacy images (`/images/*`) are fetched directly from the Express backend.

---

## 🧪 Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts Vite dev server with Hot Module Replacement (HMR) at port 5173 |
| `npm run build` | Compiles and optimizes assets into production bundle (`dist/`) |
| `npm run preview` | Locally preview the production build |
| `npm run lint` | Runs ESLint to check for code issues |

---

## 🎨 Theme & Color Customization

The theme colors are defined in `src/index.css` using Tailwind v4 `@theme`:

- **Brand Coral**: `--color-brand: #e85d45` / `#FF385C`
- **Dark Brand**: `--color-brand-dark: #ca4530`
- **Text Ink**: `--color-ink: #242923`
- **Muted Text**: `--color-muted: #747971`
- **Canvas Background**: `--color-canvas: #faf9f6`
- **Border Lines**: `--color-line: #e7e8e2`

---

## 🔍 Troubleshooting

- **"Cannot reach the server. Please check your connection"**:
  Make sure your Express server is running on `http://localhost:3000`. Test it by opening `http://localhost:3000/api/health` in your browser.
- **Port 5173 already in use**:
  Vite will automatically pick the next available port (e.g., `5174`). If this happens, remember to update `APP_ORIGIN` in `server/.env` to match your frontend port.
- **Image not displaying**:
  Ensure local static files are placed in `public/images/` and referenced with absolute paths (e.g., `/images/Logo.svg`).
