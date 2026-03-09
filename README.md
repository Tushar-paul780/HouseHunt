# 🏠 HouseHunt — Full MERN Stack Real Estate Application

> React 18 · Vite 5 · Tailwind CSS 3 · Node.js · Express · MongoDB · JWT Auth

---

## Project Structure

```
househunt/
├── backend/                   ← Express + MongoDB API
│   ├── config/
│   │   └── db.js              ← Mongoose connection
│   ├── controllers/
│   │   ├── authController.js  ← register / login / me
│   │   ├── propertyController.js  ← CRUD + search/filter/pagination
│   │   └── bookingController.js   ← create booking / list user bookings
│   ├── middleware/
│   │   └── authMiddleware.js  ← JWT protect / optionalAuth / adminOnly
│   ├── models/
│   │   ├── User.js            ← name, email, password (hashed), phone, role
│   │   ├── Property.js        ← full property schema + virtuals
│   │   └── Booking.js         ← user ↔ property booking
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── propertyRoutes.js
│   │   └── bookingRoutes.js
│   ├── scripts/
│   │   └── seed.js            ← populates 70+ properties + demo user
│   ├── .env                   ← environment config
│   ├── package.json
│   └── server.js              ← app entry point, port 5000
│
└── src/                       ← React + Vite frontend
    ├── api/
    │   ├── client.js          ← axios instance + JWT interceptor
    │   ├── auth.js            ← auth API helpers
    │   ├── properties.js      ← property API helpers + sort/price mappers
    │   └── bookings.js        ← booking API helpers
    ├── context/
    │   └── AuthContext.jsx    ← JWT-aware auth state + bootstrap
    ├── components/
    │   ├── Navbar.jsx
    │   ├── PropertyCard.jsx
    │   ├── FeaturedProperties.jsx  ← fetches from API with filters + load more
    │   └── ...
    └── pages/
        ├── SignIn.jsx         ← POST /api/auth/login
        ├── SignUp.jsx         ← POST /api/auth/register
        ├── SearchResults.jsx  ← GET /api/properties + all filters
        ├── PropertyDetails.jsx ← GET /api/properties/:id + POST /api/bookings
        └── ListProperty.jsx   ← POST /api/properties (auth required)
```

---

## Prerequisites

| Tool | Minimum Version |
|------|----------------|
| Node.js | 18.x |
| npm | 9.x |
| MongoDB | 6.x (local) **or** MongoDB Atlas free tier |

---

## Quick Start

### 1. Clone / unzip the project
```bash
unzip househunt_v3.zip
cd househunt
```

### 2. Set up the backend
```bash
cd backend
cp .env .env          # .env already provided — edit MONGO_URI if needed
npm install
```

### 3. Set up the frontend
```bash
cd ..                 # back to househunt/
npm install
```

### 4. Seed the database (first time only)
```bash
cd backend
npm run seed
```
This creates:
- **Demo user:** `demo@househunt.com` / `demo1234` (admin role)
- **70 properties** across Mumbai, Delhi, Bangalore, Kolkata, Dubai, London, New York, Singapore, and more

### 5. Start both servers

**Terminal 1 — Backend (port 5000)**
```bash
cd backend
npm run dev      # nodemon hot-reload
# or: npm start  # production
```

**Terminal 2 — Frontend (port 5173)**
```bash
cd househunt     # project root
npm run dev
```

**Open:** http://localhost:5173

---

## Environment Variables

### `backend/.env`
```env
MONGO_URI=mongodb://127.0.0.1:27017/househunt
JWT_SECRET=househunt_jwt_super_secret_key_change_in_prod_2025
JWT_EXPIRES_IN=7d
PORT=5000
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

**MongoDB Atlas:** Replace `MONGO_URI` with your Atlas connection string:
```
MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/househunt?retryWrites=true&w=majority
```

### `househunt/.env` (frontend)
```env
VITE_API_URL=http://localhost:5000/api
```

---

## Database Seed

```bash
cd backend
npm run seed
```

| Account | Email | Password | Role |
|---------|-------|----------|------|
| Demo | demo@househunt.com | demo1234 | admin |

You can register additional accounts via the Sign Up page.

---

## API Reference

### Authentication

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | Public | Register new user |
| POST | `/api/auth/login` | Public | Login, returns JWT |
| GET | `/api/auth/me` | 🔒 JWT | Get current user |
| PUT | `/api/auth/profile` | 🔒 JWT | Update name/phone |

### Properties

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/properties` | Public | List with filters + pagination |
| GET | `/api/properties/:id` | Public | Single property |
| POST | `/api/properties` | 🔒 JWT | Create listing |
| PUT | `/api/properties/:id` | 🔒 Owner/Admin | Update listing |
| DELETE | `/api/properties/:id` | 🔒 Owner/Admin | Soft delete |
| GET | `/api/properties/my` | 🔒 JWT | My listings |

**GET /api/properties — Query Parameters:**
| Param | Example | Description |
|-------|---------|-------------|
| location | Mumbai | City/address text search |
| city | London | Exact city filter |
| status | For Sale | "For Sale" or "For Rent" |
| propertyType | Apartment | House/Apartment/Villa/Studio/… |
| minPrice | 500000 | Minimum price |
| maxPrice | 2000000 | Maximum price |
| bedrooms | 3 | Number of bedrooms (or "5+") |
| sort | price-asc | newest/oldest/price-asc/price-desc/beds |
| page | 1 | Page number |
| limit | 12 | Results per page (max 50) |
| featured | true | Featured listings only |
| search | beach villa | Full-text search |

### Bookings

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/bookings` | 🔒 JWT | Create booking/viewing request |
| GET | `/api/bookings/my` | 🔒 JWT | My bookings |
| GET | `/api/bookings/user/:id` | 🔒 JWT | User's bookings (own or admin) |
| PUT | `/api/bookings/:id/cancel` | 🔒 JWT | Cancel booking |

---

## Frontend Integration

All API calls go through `src/api/client.js` — an axios instance that:
- Reads `VITE_API_URL` for the base URL
- Automatically attaches `Authorization: Bearer <token>` from localStorage/sessionStorage
- Clears tokens on 401 responses

### Where each page connects:
| Page | API Call |
|------|----------|
| SignIn | `POST /api/auth/login` |
| SignUp | `POST /api/auth/register` |
| Home (FeaturedProperties) | `GET /api/properties?limit=8` |
| SearchResults | `GET /api/properties?<all filters>` |
| PropertyDetails | `GET /api/properties/:id` + `POST /api/bookings` |
| ListProperty | `POST /api/properties` |

---

## Authentication Flow

1. User submits login form → `POST /api/auth/login`
2. Server returns `{ success, token, user }`
3. Token stored in `localStorage` (remember me) or `sessionStorage`
4. `AuthContext` bootstraps on mount by calling `GET /api/auth/me`
5. Every API request attaches `Authorization: Bearer <token>` via axios interceptor
6. On 401, tokens are cleared and user is signed out

---

## Example API Requests

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice Smith","email":"alice@example.com","password":"secret123","phone":"555-9999"}'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@househunt.com","password":"demo1234"}'
```

### Get Properties (filtered)
```bash
curl "http://localhost:5000/api/properties?city=London&status=For+Sale&sort=price-asc&page=1&limit=6"
```

### Create Property (auth required)
```bash
curl -X POST http://localhost:5000/api/properties \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_jwt_token>" \
  -d '{
    "title": "Stunning Chelsea Flat",
    "description": "Luxurious flat in the heart of Chelsea with river views and modern finishes.",
    "price": 3200,
    "location": "Chelsea, SW3",
    "city": "London",
    "propertyType": "Apartment",
    "bedrooms": 2,
    "bathrooms": 2,
    "area": 950,
    "status": "For Rent",
    "images": ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600"]
  }'
```

### Create Booking
```bash
curl -X POST http://localhost:5000/api/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_jwt_token>" \
  -d '{"propertyId":"<property_id>","bookingDate":"2025-08-15","message":"Can we view this Saturday?"}'
```

### Health Check
```bash
curl http://localhost:5000/api/health
```

---

## Tech Stack Summary

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite 5, Tailwind CSS 3, React Router v6 |
| HTTP Client | Axios 1.x (with JWT interceptor) |
| Backend | Node.js 18, Express 4 |
| Database | MongoDB 6 + Mongoose 8 |
| Auth | JWT (jsonwebtoken) + bcryptjs |
| Dev tools | nodemon, morgan |

