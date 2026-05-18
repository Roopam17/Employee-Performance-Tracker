# Postman API Testing Guide — PerformAI

## Setup

1. Download Postman: https://www.postman.com/downloads/
2. Create a new **Collection** called "PerformAI API"
3. Set base URL variable: `{{BASE_URL}}` = `http://localhost:5000/api`
4. Add a collection variable `{{TOKEN}}` (leave empty for now)

---

## 1. AUTH TESTS

### 1.1 Signup
- **Method**: POST
- **URL**: `{{BASE_URL}}/auth/signup`
- **Headers**: Content-Type: application/json
- **Body** (raw JSON):
```json
{
  "name": "Admin User",
  "email": "admin@company.com",
  "password": "password123",
  "role": "admin"
}
```
- **Expected Response** (201):
```json
{
  "success": true,
  "message": "Account created successfully",
  "data": {
    "_id": "...",
    "name": "Admin User",
    "email": "admin@company.com",
    "role": "admin",
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

### 1.2 Login
- **Method**: POST
- **URL**: `{{BASE_URL}}/auth/login`
- **Body**:
```json
{
  "email": "admin@company.com",
  "password": "password123"
}
```
- Copy the `token` from response and set `{{TOKEN}}` variable

### 1.3 Get Profile
- **Method**: GET
- **URL**: `{{BASE_URL}}/auth/me`
- **Headers**: Authorization: Bearer {{TOKEN}}

---

## 2. EMPLOYEE TESTS

### 2.1 Create Employee
- **Method**: POST
- **URL**: `{{BASE_URL}}/employees`
- **Headers**: Authorization: Bearer {{TOKEN}}
- **Body**:
```json
{
  "name": "Priya Mehta",
  "email": "priya@company.com",
  "department": "Engineering",
  "skills": ["Python", "Machine Learning", "TensorFlow", "SQL"],
  "performanceScore": 92,
  "yearsOfExperience": 6
}
```
- **Expected**: 201 with employee data + copy `_id` for later tests

### 2.2 Get All Employees
- **Method**: GET
- **URL**: `{{BASE_URL}}/employees`
- **Headers**: Authorization: Bearer {{TOKEN}}
- Add optional query params: `?department=Engineering&minScore=70&sortBy=performanceScore&order=desc`

### 2.3 Search Employees
- **Method**: GET
- **URL**: `{{BASE_URL}}/employees/search?q=Python`
- **Headers**: Authorization: Bearer {{TOKEN}}

### 2.4 Update Employee
- **Method**: PUT
- **URL**: `{{BASE_URL}}/employees/{{EMPLOYEE_ID}}`
- **Headers**: Authorization: Bearer {{TOKEN}}
- **Body**:
```json
{
  "performanceScore": 95,
  "yearsOfExperience": 7
}
```

### 2.5 Delete Employee
- **Method**: DELETE
- **URL**: `{{BASE_URL}}/employees/{{EMPLOYEE_ID}}`
- **Headers**: Authorization: Bearer {{TOKEN}}

---

## 3. AI TESTS

### 3.1 Get AI Recommendation
- **Method**: POST
- **URL**: `{{BASE_URL}}/ai/recommend`
- **Headers**: Authorization: Bearer {{TOKEN}}
- **Body**:
```json
{
  "employeeId": "{{EMPLOYEE_ID}}"
}
```
- **Expected**: AI-generated recommendation text (takes 5-15 seconds)

### 3.2 Rank All Employees
- **Method**: POST
- **URL**: `{{BASE_URL}}/ai/rank-all`
- **Headers**: Authorization: Bearer {{TOKEN}}
- **Body**: (empty)

---

## Common Errors

| Error | Cause | Fix |
|---|---|---|
| 401 Unauthorized | Missing/expired token | Login again and update {{TOKEN}} |
| 400 Email exists | Duplicate email | Use different email |
| 402 Quota exceeded | OpenAI billing issue | Check OpenAI account |
| 404 Not found | Wrong employee ID | Verify the ID |
