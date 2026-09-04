# 🔐 SecureAuth — Secure User Authentication System

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://react.dev)
[![MongoDB](https://img.shields.io/badge/MongoDB-7+-47A248?logo=mongodb)](https://mongodb.com)
[![JWT](https://img.shields.io/badge/JWT-Auth-000000?logo=json-web-tokens)](https://jwt.io)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A **production-quality, full-stack authentication system** built as an interview assignment.
Implements registration, login, JWT-based session management, and role-based access control (RBAC) with a beautiful, modern dark UI.

---

## ✨ Features

- 🔒 **Secure Registration & Login** — bcrypt password hashing (salt rounds: 12)
- 🎫 **JWT Authentication** — stateless tokens with automatic expiry (7 days)
- 👮 **Role-Based Access Control** — `user` and `admin` roles
- 🛡️ **Protected Routes** — frontend + backend double protection
- 📊 **Admin Dashboard** — user management with statistics
- 🚦 **Rate Limiting** — 10 req/15 min on auth endpoints
- 🪖 **Helmet** — secure HTTP response headers
- 🌐 **CORS** — restricted to configured frontend origin
- ✅ **Input Validation** — express-validator on every endpoint
- 🎨 **Modern Dark UI** — glassmorphism, animations, fully responsive
- 🔔 **Toast Notifications** — real-time feedback
- 💪 **Password Strength Meter** — visual indicator on registration
- 👁️ **Password Toggle** — show/hide password fields

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| Styling | Tailwind CSS v3 |
| State Management | React Context + useReducer |
| HTTP Client | Axios (with interceptors) |
| Backend | Node.js + Express |
| Database | MongoDB + Mongoose |
| Authentication | JSON Web Tokens (JWT) |
| Password Security | bcryptjs |
| Validation | express-validator |
| Security | Helmet, CORS, express-rate-limit |

---

## 📁 Project Structure

```
auth-project/
├── client/                    # React + Vite frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Navbar.jsx          # Responsive navbar
│   │   │   │   ├── ProtectedRoute.jsx  # Auth guard
│   │   │   │   └── AdminRoute.jsx      # Admin guard
│   │   │   └── ui/
│   │   │       ├── FormInput.jsx       # Input with icon + error
│   │   │       ├── Button.jsx          # Button with loading state
│   │   │       ├── Alert.jsx           # Error/success banner
│   │   │       └── LoadingScreen.jsx   # Full-page loader
│   │   ├── context/
│   │   │   └── AuthContext.jsx         # Global auth state
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── AdminPage.jsx
│   │   │   └── NotFoundPage.jsx
│   │   ├── services/
│   │   │   ├── api.js                  # Axios instance + interceptors
│   │   │   └── authService.js          # API call wrappers
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   └── package.json
│
├── server/                    # Node.js + Express backend
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js  # register, login, getMe
│   │   └── userController.js  # getAllUsers, getAdminStats
│   ├── middleware/
│   │   ├── authMiddleware.js  # JWT verification
│   │   ├── roleMiddleware.js  # RBAC
│   │   └── errorMiddleware.js # Global error handler
│   ├── models/
│   │   └── User.js            # Mongoose User schema
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── userRoutes.js
│   ├── utils/
│   │   └── generateToken.js   # JWT signing helper
│   ├── seed.js                # Demo data seeder
│   ├── .env.example
│   └── server.js              # Express entry point
│
├── .gitignore
├── .env.example
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or newer
- [MongoDB](https://www.mongodb.com/) (local or [Atlas](https://www.mongodb.com/atlas))
- npm v9+

---

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/auth-project.git
cd auth-project
```

---

### 2. Configure Environment Variables

**Backend** (`server/.env`):
```bash
cd server
cp .env.example .env
```
Edit `server/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/auth_db
JWT_SECRET=your_super_secret_32_char_minimum_key
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

**Frontend** (`client/.env`):
```bash
cd ../client
cp .env.example .env
```
Edit `client/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

---

### 3. Install Dependencies

```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

---

### 4. Seed Demo Users (optional)

```bash
cd server
node seed.js
```

This creates:
| Email | Password | Role |
|-------|----------|------|
| admin@demo.com | Admin@12345 | admin |
| user@demo.com | User@12345 | user |

---

### 5. Run the Application

**Start the backend** (terminal 1):
```bash
cd server
npm run dev
# Server running on http://localhost:5000
```

**Start the frontend** (terminal 2):
```bash
cd client
npm run dev
# App running on http://localhost:5173
```

---

## 🔌 API Documentation

All JSON responses follow this shape:
```json
{
  "success": true | false,
  "message": "...",
  "data": { ... }
}
```

### Auth Endpoints

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| `POST` | `/api/auth/register` | ❌ | Create new account |
| `POST` | `/api/auth/login` | ❌ | Login, receive JWT |
| `GET` | `/api/auth/me` | ✅ | Get current user |

#### POST /api/auth/register
```json
// Request body
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password@1",
  "confirmPassword": "Password@1"
}

// 201 Response
{
  "success": true,
  "token": "<jwt>",
  "user": { "id", "name", "email", "role", "createdAt" }
}
```

#### POST /api/auth/login
```json
// Request body
{ "email": "john@example.com", "password": "Password@1" }

// 200 Response
{
  "success": true,
  "token": "<jwt>",
  "user": { "id", "name", "email", "role", "createdAt" }
}
```

### Admin Endpoints (require `admin` role)

| Method | Route | Description |
|--------|-------|-------------|
| `GET` | `/api/users` | List all users |
| `GET` | `/api/admin/stats` | Dashboard statistics |

All admin requests must include:
```
Authorization: Bearer <token>
```

### HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Resource created |
| 400 | Validation error |
| 401 | Not authenticated |
| 403 | Forbidden (wrong role) |
| 404 | Not found |
| 409 | Conflict (duplicate email) |
| 429 | Too many requests |
| 500 | Server error |

---

## 🔐 Authentication Flow

```
1. User registers → password hashed with bcrypt (cost=12) → stored in MongoDB
2. User logs in → bcrypt.compare() → JWT signed with HS256
3. JWT stored in localStorage
4. Axios interceptor: attaches "Authorization: Bearer <token>" to every request
5. protect middleware: verifies JWT, fetches fresh user, attaches to req.user
6. requireRole middleware: checks req.user.role against allowed roles
7. On logout: localStorage cleared → JWT discarded (stateless)
8. On page refresh: stored token re-verified against server via GET /api/auth/me
```

---

## 🛡️ Security Features

| Feature | Implementation |
|---------|---------------|
| Password hashing | bcryptjs, salt rounds = 12 |
| Token authentication | JWT HS256, 7-day expiry |
| Auth middleware | Verifies token on every protected route |
| Role authorization | requireRole() middleware factory |
| Input validation | express-validator on all inputs |
| Secure headers | helmet (CSP, HSTS, X-Frame-Options, etc.) |
| CORS | Restricted to CLIENT_URL only |
| Rate limiting | 10 req / 15 min on /register and /login |
| No password in response | schema `select: false` + toJSON transform |
| Generic error messages | No email enumeration on login failure |
| Request size limit | 10 KB body limit |
| Secrets management | All secrets via environment variables |

---

## 📸 Screenshots

> _Add screenshots of Login, Register, Dashboard, and Admin pages here._

---

## 🚀 Deployment

### Deploy Backend to Render.com (free)

1. Push code to GitHub.
2. Create a new **Web Service** on [render.com](https://render.com).
3. Set **Root Directory**: `server`
4. **Build Command**: `npm install`
5. **Start Command**: `npm start`
6. Add environment variables:
   - `MONGODB_URI` → MongoDB Atlas connection string
   - `JWT_SECRET` → strong random secret (use `openssl rand -base64 48`)
   - `CLIENT_URL` → your Vercel frontend URL
   - `NODE_ENV` → `production`

### Deploy Frontend to Vercel (free)

1. Push code to GitHub.
2. Create a new project on [vercel.com](https://vercel.com).
3. Set **Root Directory**: `client`
4. **Framework Preset**: Vite
5. Add environment variable:
   - `VITE_API_URL` → your Render.com backend URL + `/api`

### MongoDB Atlas (free tier)

1. Create a free cluster at [cloud.mongodb.com](https://cloud.mongodb.com).
2. Create a database user.
3. Whitelist IP `0.0.0.0/0` (or Render.com outbound IPs).
4. Copy the connection string to your backend `MONGODB_URI`.

---

## 🔮 Future Improvements

- [ ] Email verification on registration
- [ ] Forgot password / password reset via email
- [ ] Refresh token rotation
- [ ] Two-factor authentication (TOTP)
- [ ] OAuth (Google / GitHub social login)
- [ ] Account management (change password, update profile)
- [ ] Admin: activate / deactivate user accounts
- [ ] Comprehensive test suite (Jest + Supertest + Vitest)
- [ ] Docker + Docker Compose setup
- [ ] CI/CD pipeline with GitHub Actions

---

## 👤 Author

**Your Name**
- GitHub: [@YOUR_USERNAME](https://github.com/YOUR_USERNAME)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/YOUR_PROFILE)

---

## 📄 License

MIT License — feel free to use this project for learning and interviews.
