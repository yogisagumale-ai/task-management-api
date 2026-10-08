# Task Management REST API

A CRUD REST API built with Node.js, Express, SQLite, bcryptjs, and JWT authentication.

## Features

- User registration
- Password hashing with bcrypt
- User login with JWT token
- Protected task CRUD routes
- SQLite database
- Input validation
- Proper HTTP status codes
- Each user can access only their own tasks

## Requirements

- Node.js 18+ recommended
- VS Code
- Postman or Insomnia

## Installation

```bash
npm install
```

Create a `.env` file:

```env
PORT=5000
JWT_SECRET=change_this_to_a_long_random_secret_key
```

Start the server:

```bash
npm start
```

For development:

```bash
npm run dev
```

Server:

`http://localhost:5000`

## Endpoints

### 1. Register

**POST** `/api/auth/register`

Body:

```json
{
  "name": "Yogesh",
  "email": "yogesh@example.com",
  "password": "password123"
}
```

Success: **201**

```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "name": "Yogesh",
    "email": "yogesh@example.com"
  }
}
```

### 2. Login

**POST** `/api/auth/login`

Body:

```json
{
  "email": "yogesh@example.com",
  "password": "password123"
}
```

Success: **200**

```json
{
  "message": "Login successful",
  "token": "JWT_TOKEN",
  "user": {
    "id": 1,
    "name": "Yogesh",
    "email": "yogesh@example.com"
  }
}
```

Copy the token from this response.

For protected routes, add this header:

```text
Authorization: Bearer JWT_TOKEN
```

### 3. Get all tasks

**GET** `/api/tasks`

Header:

```text
Authorization: Bearer JWT_TOKEN
```

Success: **200**

```json
{
  "tasks": []
}
```

### 4. Get one task

**GET** `/api/tasks/1`

Header:

```text
Authorization: Bearer JWT_TOKEN
```

Success: **200**

```json
{
  "task": {
    "id": 1,
    "title": "Learn Express",
    "description": "Build REST API",
    "status": "pending",
    "user_id": 1
  }
}
```

### 5. Create task

**POST** `/api/tasks`

Header:

```text
Authorization: Bearer JWT_TOKEN
Content-Type: application/json
```

Body:

```json
{
  "title": "Complete internship project",
  "description": "Build and test the REST API",
  "status": "pending"
}
```

Success: **201**

### 6. Update task

**PUT** `/api/tasks/1`

Header:

```text
Authorization: Bearer JWT_TOKEN
Content-Type: application/json
```

Body:

```json
{
  "title": "Complete API project",
  "description": "Test the API using Postman",
  "status": "in-progress"
}
```

Success: **200**

### 7. Delete task

**DELETE** `/api/tasks/1`

Header:

```text
Authorization: Bearer JWT_TOKEN
```

Success: **200**

```json
{
  "message": "Task deleted successfully"
}
```

## Status Codes

| Code | Meaning |
|---|---|
| 200 | Successful request |
| 201 | Resource created |
| 400 | Invalid input |
| 401 | Authentication required/invalid |
| 404 | Resource not found |
| 500 | Server error |

## Testing Flow in Postman

1. Register a user.
2. Login with the same user.
3. Copy the JWT token.
4. Add `Authorization: Bearer <token>` to protected requests.
5. Create a task.
6. Get all tasks.
7. Get the task by ID.
8. Update the task.
9. Delete the task.
10. Test an unauthenticated request and confirm it returns **401**.

## GitHub

Do not upload `.env` or the SQLite database file. The included `.gitignore` prevents them from being committed.

Create a public GitHub repository and push this project after testing it locally.
