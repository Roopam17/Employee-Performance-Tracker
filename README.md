# 🚀 PerformAI — AI-Based Employee Performance Analytics & Recommendation System

A full-stack MERN application that uses **OpenAI GPT** to analyze employee performance and generate intelligent recommendations including promotion advice, training suggestions, employee ranking, and AI-generated feedback.

---

## 📋 Table of Contents

1. [Project Overview](#-project-overview)
2. [Features](#-features)
3. [Tech Stack](#-tech-stack)
4. [Folder Structure](#-folder-structure)
5. [Local Setup](#-local-setup)
6. [Environment Variables](#-environment-variables)
7. [API Endpoints](#-api-endpoints)
8. [Deployment Guide](#-deployment-guide)
9. [GitHub Guide](#-github-guide)
10. [Troubleshooting](#-troubleshooting)

---

## 🌟 Project Overview

PerformAI is an HR analytics platform that enables organizations to:
- Register and manage employees with structured performance data
- Analyze individual employees using AI to get actionable recommendations
- Rank all employees using comparative AI analysis
- Manage users with JWT-based authentication

---

## ✅ Features

- **JWT Authentication** — Signup, Login, Protected Routes
- **Employee CRUD** — Create, Read, Update, Delete with form validation
- **Search & Filter** — Search by name/email/skill, filter by department/score
- **AI Recommendations** — Powered by OpenAI GPT:
  - Promotion recommendation
  - Performance tier classification
  - Training & course suggestions
  - AI feedback and 90-day action plan
- **Team Ranking** — Comparative AI analysis of all employees
- **Dashboard** — Stats overview, top performers, department distribution
- **Responsive UI** — Dark theme with Tailwind CSS

---

## 🛠 Tech Stack

| Layer       | Technology                    |
|-------------|-------------------------------|
| Frontend    | React 18 + Vite + Tailwind CSS |
| Routing     | React Router DOM v6           |
| HTTP Client | Axios                         |
| Backend     | Node.js + Express.js          |
| Database    | MongoDB + Mongoose            |
| Auth        | JWT + bcrypt                  |
| AI          | OpenAI API (GPT-3.5-turbo)    |
| Deployment  | Render                        |

---

## 📁 Folder Structure

```
employee-performance-ai-system/
│
├── frontend/
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   │   ├── Layout.jsx       # Sidebar + nav wrapper
│   │   │   ├── EmployeeCard.jsx # Employee display card
│   │   │   ├── StatCard.jsx     # Dashboard stat card
│   │   │   └── LoadingSpinner.jsx
│   │   ├── pages/               # Route-level pages
│   │   │   ├── LoginPage.jsx
│   │   │   ├── SignupPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── EmployeeListPage.jsx
│   │   │   ├── AddEmployeePage.jsx
│   │   │   ├── EditEmployeePage.jsx
│   │   │   └── AIRecommendationPage.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx  # Global auth state
│   │   ├── utils/
│   │   │   └── api.js           # Axios instance with JWT interceptor
│   │   ├── App.jsx              # Router configuration
│   │   ├── main.jsx             # React entry point
│   │   └── index.css            # Tailwind + global styles
│   ├── .env
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── backend/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── employeeController.js
│   │   └── aiController.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── employeeRoutes.js
│   │   └── aiRoutes.js
│   ├── middleware/
│   │   ├── authMiddleware.js    # JWT verification
│   │   └── errorHandler.js     # Global error handler
│   ├── models/
│   │   ├── User.js
│   │   └── Employee.js
│   ├── config/
│   │   └── db.js               # MongoDB connection
│   ├── utils/
│   │   └── generateToken.js    # JWT token generator
│   ├── .env
│   ├── server.js
│   └── package.json
│
├── docs/                        # Documentation files
├── README.md
└── .gitignore
```

---

## 💻 Local Setup

### Prerequisites
- Node.js v18+ — https://nodejs.org
- MongoDB Atlas account — https://cloud.mongodb.com
- OpenAI API Key — https://platform.openai.com

---

### STEP 1 — Clone/Download the Project
```bash
cd Desktop
# If cloning from GitHub:
git clone https://github.com/YOUR_USERNAME/employee-performance-ai-system.git
cd employee-performance-ai-system
```

---

### STEP 2 — Setup Backend

```bash
cd backend
npm install
```

Create/edit `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/employee_performance_db
JWT_SECRET=your_long_random_secret_key_here
OPENAI_API_KEY=sk-your-openai-api-key-here
NODE_ENV=development
```

Start backend:
```bash
npm run dev
```

Backend will run at: `http://localhost:5000`

---

### STEP 3 — Setup Frontend

Open a **new terminal**:

```bash
cd frontend
npm install
```

Edit `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

Start frontend:
```bash
npm run dev
```

Frontend will run at: `http://localhost:5173`

---

### STEP 4 — Configure MongoDB Atlas

1. Go to https://cloud.mongodb.com
2. Create a new project and cluster (free tier)
3. Click **Connect** → **Connect your application**
4. Copy the connection string and replace `<username>` and `<password>`
5. Paste it into `backend/.env` as `MONGODB_URI`
6. Under **Network Access**, add `0.0.0.0/0` (allow all IPs)

---

### STEP 5 — Get OpenAI API Key

1. Go to https://platform.openai.com/api-keys
2. Click **Create new secret key**
3. Copy the key and paste into `backend/.env` as `OPENAI_API_KEY`

> ⚠️ Note: OpenAI API requires a paid account. New accounts get free trial credits.

---

## 🔐 Environment Variables

### Backend (`backend/.env`)
| Variable | Description |
|---|---|
| `PORT` | Server port (default: 5000) |
| `MONGODB_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret key for signing JWT tokens |
| `OPENAI_API_KEY` | Your OpenAI API key |
| `NODE_ENV` | `development` or `production` |

### Frontend (`frontend/.env`)
| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend API base URL |

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Body | Access |
|---|---|---|---|
| POST | `/api/auth/signup` | `{name, email, password, role}` | Public |
| POST | `/api/auth/login` | `{email, password}` | Public |
| GET | `/api/auth/me` | — | Private |

### Employees
| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/api/employees` | Get all employees | Private |
| POST | `/api/employees` | Create employee | Private |
| GET | `/api/employees/search?q=` | Search employees | Private |
| GET | `/api/employees/:id` | Get single employee | Private |
| PUT | `/api/employees/:id` | Update employee | Private |
| DELETE | `/api/employees/:id` | Delete employee | Private |

### AI
| Method | Endpoint | Body | Access |
|---|---|---|---|
| POST | `/api/ai/recommend` | `{employeeId}` | Private |
| POST | `/api/ai/rank-all` | — | Private |

---

## 🌐 Deployment Guide

### Backend on Render

1. Push code to GitHub
2. Go to https://render.com → New → **Web Service**
3. Connect your GitHub repo
4. Settings:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
5. Add Environment Variables:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `OPENAI_API_KEY`
   - `NODE_ENV=production`
6. Click **Deploy**
7. Copy your backend URL: `https://your-backend-name.onrender.com`

---

### Frontend on Render

1. Go to Render → New → **Static Site**
2. Connect your GitHub repo
3. Settings:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
4. Add Environment Variable:
   - `VITE_API_URL=https://your-backend-name.onrender.com/api`
5. Click **Deploy**

> ⚠️ **IMPORTANT**: After your backend is deployed, update `VITE_API_URL` in the frontend environment variables to your live backend URL, then redeploy the frontend.

---

## 📤 GitHub Guide

```bash
# Initialize repository
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Employee Performance AI System"

# Set branch to main
git branch -M main

# Add remote (replace with YOUR repo URL)
git remote add origin https://github.com/YOUR_USERNAME/employee-performance-ai-system.git

# Push to GitHub
git push -u origin main
```

For future changes:
```bash
git add .
git commit -m "Your commit message"
git push
```

---

## 🧪 Testing with Postman

### 1. Signup
```json
POST http://localhost:5000/api/auth/signup
Body: { "name": "Admin User", "email": "admin@test.com", "password": "password123", "role": "admin" }
```

### 2. Login (get token)
```json
POST http://localhost:5000/api/auth/login
Body: { "email": "admin@test.com", "password": "password123" }
```

### 3. Add Employee (use token from login)
```json
POST http://localhost:5000/api/employees
Header: Authorization: Bearer <token>
Body: {
  "name": "Rahul Sharma",
  "email": "rahul@company.com",
  "department": "Engineering",
  "skills": ["JavaScript", "React", "Node.js"],
  "performanceScore": 87,
  "yearsOfExperience": 5
}
```

### 4. AI Recommend
```json
POST http://localhost:5000/api/ai/recommend
Header: Authorization: Bearer <token>
Body: { "employeeId": "<employee_id_from_step_3>" }
```

---

## 🔧 Troubleshooting

| Problem | Solution |
|---|---|
| `ECONNREFUSED` on frontend | Ensure backend is running on port 5000 |
| `MongoServerError` | Check your `MONGODB_URI` and whitelist your IP |
| `Invalid API Key` | Verify your `OPENAI_API_KEY` in backend `.env` |
| `Token expired` | Log out and log in again |
| CORS errors | Check that `FRONTEND_URL` is set in production backend env |
| Port 5173 busy | Change port in `vite.config.js` |
| `npm ERR! missing script` | Make sure you're in the right directory |

---

## 📸 Screenshots
*(Add screenshots of your running application here)*

- Dashboard Page
- Employee List Page
- Add Employee Form
- AI Recommendation Results
- Login Page

---

## 👨‍💻 Author

Built for University ESE Practical Examination  
Tech Stack: MERN + OpenAI API
