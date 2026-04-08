# BudgetPacker - AI Trip Planner for Budget Backpackers 🎒

A full-stack MERN application that uses Google Gemini AI to generate budget-friendly travel itineraries for students and backpackers in India.

## Features

- 🤖 **AI-Powered Itineraries** — Generates day-by-day plans with real trains, hostels, and food spots
- 💬 **Conversational Planning** — Chat with AI to modify plans (e.g., "train ticket nahi mila")
- 📊 **Budget Comparison** — Compare lower/higher budget alternatives side-by-side
- 📦 **Curated Packages** — Pre-built travel packages with search functionality
- 🔐 **User Authentication** — JWT-based login/register system
- 💾 **Saved Trips** — Save and revisit your favorite itineraries
- 🖨️ **Offline Print** — Print-friendly itinerary for areas without internet
- 🎒 **Packing List** — AI-generated "Things to Carry" based on destination

## Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | React, Vite, TailwindCSS, Framer Motion |
| Backend    | Node.js, Express.js                 |
| Database   | MongoDB (Mongoose)                  |
| AI Engine  | Google Gemini 2.5 Flash             |
| Auth       | JWT, bcryptjs                       |

## Project Structure

```
AI Trip/
├── backend/
│   ├── config/          # Database configuration
│   ├── middleware/       # Auth middleware (JWT)
│   ├── models/           # Mongoose schemas (User, Trip)
│   ├── routes/           # API route handlers
│   ├── services/         # AI service (Gemini integration)
│   ├── .env              # Environment variables (not committed)
│   ├── .gitignore
│   ├── package.json
│   └── server.js         # Express app entry point
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/   # Reusable UI components (Navbar)
│   │   ├── context/      # React Context (AuthContext)
│   │   ├── pages/        # Page components (Home, Itinerary, Login, etc.)
│   │   ├── App.jsx       # Root component with routing
│   │   ├── main.jsx      # Vite entry point
│   │   └── index.css     # Global styles + Tailwind
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
└── README.md
```

## Getting Started

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- Google AI Studio API Key

### Setup

1. **Clone the repo**
2. **Backend Setup**
   ```bash
   cd backend
   cp .env.example .env    # Add your keys
   npm install
   npm run dev
   ```
3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
4. Open `http://localhost:5173` in your browser

## Environment Variables

Create a `backend/.env` file:
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_google_ai_studio_key
JWT_SECRET=your_jwt_secret
```
