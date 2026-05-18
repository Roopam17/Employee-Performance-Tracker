# PerformAI — Project Documentation Report

## 1. Introduction

PerformAI is an AI-powered Employee Performance Analytics and Recommendation System built using the MERN stack (MongoDB, Express.js, React, Node.js) integrated with the OpenAI API. The system provides HR professionals and managers with intelligent insights into employee performance, enabling data-driven decisions for promotions, training, and organizational growth.

---

## 2. Objectives

- Build a secure full-stack web application with JWT authentication
- Implement complete CRUD operations for employee management
- Integrate OpenAI GPT to generate AI-powered performance recommendations
- Design a responsive, modern dark-themed UI
- Enable deployment on cloud platforms (Render + MongoDB Atlas)

---

## 3. Features

### Authentication
- User registration (Signup) with role selection (HR, Manager, Admin)
- Secure login with JWT token generation
- Protected routes on both frontend and backend
- bcrypt password hashing

### Employee Management
- Add new employees with structured data (name, email, department, skills, score, experience)
- View all employees in a card-based grid layout
- Edit and update employee details
- Delete employees with confirmation
- Search employees by name, email, department, or skills
- Filter by department, min/max performance score
- Sort by score, name, or date added

### AI Features
- **Individual Analysis**: Select any employee → OpenAI generates:
  - Promotion recommendation with justification
  - Performance tier classification
  - 3-5 training course suggestions
  - Constructive AI feedback
  - 90-day career development action plan
- **Team Ranking**: Comparative analysis of all employees with:
  - Ranked list from best to least performer
  - Top 3 promotion candidates
  - Employees requiring support

### Dashboard
- Total employee count
- Company-wide average performance score
- Count of top performers (score ≥ 85)
- Count of employees needing support (score < 50)
- Top 5 performers leaderboard
- Department distribution bar chart

---

## 4. System Architecture

```
[React Frontend] ←→ [Express API Server] ←→ [MongoDB Atlas]
                              ↓
                      [OpenAI GPT API]
```

### Data Flow
1. User logs in → JWT token issued
2. Frontend stores token in localStorage
3. Axios interceptor attaches token to every API call
4. Backend verifies token using middleware
5. Authorized requests hit controllers → MongoDB operations
6. AI requests → OpenAI API → response saved to DB

---

## 5. Database Schema

### User Collection
```json
{
  "name": "String (required)",
  "email": "String (unique, required)",
  "password": "String (hashed, required)",
  "role": "Enum: hr | manager | admin"
}
```

### Employee Collection
```json
{
  "name": "String (required)",
  "email": "String (unique, required)",
  "department": "Enum (10 options)",
  "skills": "[String] (required, min 1)",
  "performanceScore": "Number (0-100)",
  "yearsOfExperience": "Number (0-50)",
  "aiRecommendation": "String (nullable)",
  "lastAnalyzed": "Date (nullable)",
  "createdBy": "ObjectId ref User"
}
```

---

## 6. API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/signup | Register user |
| POST | /api/auth/login | Login user |
| GET | /api/auth/me | Get current user |
| GET | /api/employees | List all employees |
| POST | /api/employees | Create employee |
| GET | /api/employees/search | Search employees |
| GET | /api/employees/:id | Get one employee |
| PUT | /api/employees/:id | Update employee |
| DELETE | /api/employees/:id | Delete employee |
| POST | /api/ai/recommend | AI individual analysis |
| POST | /api/ai/rank-all | AI team ranking |

---

## 7. Security Measures

- Passwords hashed with bcrypt (10 salt rounds)
- JWTs expire after 7 days
- Token verification on every protected endpoint
- No secrets in frontend code
- Mongoose schema validation prevents bad data
- Duplicate email detection

---

## 8. Screenshots Placeholders

*(Replace with actual screenshots when submitting)*

### 8.1 Login Page
[Screenshot: Login page with email and password fields]

### 8.2 Signup Page
[Screenshot: Registration form with role selection]

### 8.3 Dashboard
[Screenshot: Stats cards + top performers + department chart]

### 8.4 Employee List
[Screenshot: Grid of employee cards with search bar]

### 8.5 Add Employee Form
[Screenshot: Form with skill chips and validation]

### 8.6 AI Recommendation
[Screenshot: AI-generated analysis with formatted sections]

### 8.7 Team Ranking
[Screenshot: AI-ranked team overview with score table]

### 8.8 MongoDB Atlas
[Screenshot: Database collections in Atlas]

### 8.9 Render Deployment
[Screenshot: Backend and frontend deployed on Render]

### 8.10 Postman API Testing
[Screenshot: Sample API calls in Postman]

---

## 9. Deployment

- **Backend**: Deployed as Web Service on Render
- **Frontend**: Deployed as Static Site on Render
- **Database**: MongoDB Atlas (free tier M0)
- **Environment variables**: Managed via Render dashboard

---

## 10. Conclusion

PerformAI successfully demonstrates a complete, production-ready full-stack MERN application with:
- Secure JWT authentication
- Full employee CRUD with real-time search and filtering
- OpenAI GPT integration for intelligent HR recommendations
- Responsive dark-themed UI built with React and Tailwind CSS
- Cloud deployment compatibility

The system provides practical value to HR teams by combining structured performance data with AI-powered analysis, enabling faster and more informed talent management decisions.
