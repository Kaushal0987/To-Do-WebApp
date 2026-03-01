# Laravel To-Do API Documentation

## Base URL

```
http://localhost:8000/api
```

## Authentication

The API uses Laravel Sanctum for token-based authentication. Include the token in the `Authorization` header:

```
Authorization: Bearer {token}
```

---

## Public Endpoints

### Register User

**POST** `/register`

Creates a new user account and returns an authentication token.

**Request Body:**

```json
{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
}
```

**Success Response (201):**

```json
{
    "message": "User registered successfully",
    "user": {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com"
    },
    "token": "1|abcdef123456..."
}
```

---

### Login

**POST** `/login`

Authenticates a user and returns a token.

**Request Body:**

```json
{
    "email": "demo@example.com",
    "password": "password"
}
```

**Success Response (200):**

```json
{
    "message": "Login successful",
    "user": {
        "id": 1,
        "name": "Demo User",
        "email": "demo@example.com"
    },
    "token": "1|abcdef123456..."
}
```

**Error Response (422):**

```json
{
    "message": "The provided credentials are incorrect.",
    "errors": {
        "email": ["The provided credentials are incorrect."]
    }
}
```

---

## Protected Endpoints (Require Authentication)

### Get Current User

**GET** `/user`

Returns the authenticated user's information.

**Headers:**

```
Authorization: Bearer {token}
```

**Success Response (200):**

```json
{
    "user": {
        "id": 1,
        "name": "Demo User",
        "email": "demo@example.com"
    }
}
```

---

### Logout

**POST** `/logout`

Revokes the current access token.

**Headers:**

```
Authorization: Bearer {token}
```

**Success Response (200):**

```json
{
    "message": "Logout successful"
}
```

---

## Task Endpoints

### Get All Tasks

**GET** `/tasks`

Returns all tasks for the authenticated user, ordered by creation date (newest first).

**Headers:**

```
Authorization: Bearer {token}
```

**Success Response (200):**

```json
{
    "tasks": [
        {
            "id": 1,
            "user_id": 1,
            "title": "Complete project documentation",
            "flag": "Ongoing",
            "created_at": "2026-02-28T06:00:00.000000Z",
            "updated_at": "2026-02-28T06:00:00.000000Z"
        }
    ]
}
```

---

### Create Task

**POST** `/tasks`

Creates a new task for the authenticated user.

**Headers:**

```
Authorization: Bearer {token}
```

**Request Body:**

```json
{
    "title": "Buy groceries",
    "flag": "Ongoing" // Optional: "Ongoing", "Due", or "Complete". Default: "Ongoing"
}
```

**Success Response (201):**

```json
{
    "message": "Task created successfully",
    "task": {
        "title": "Buy groceries",
        "flag": "Ongoing",
        "user_id": 1,
        "updated_at": "2026-02-28T06:00:00.000000Z",
        "created_at": "2026-02-28T06:00:00.000000Z",
        "id": 2
    }
}
```

---

### Get Single Task

**GET** `/tasks/{id}`

Returns a specific task by ID (only if it belongs to authenticated user).

**Headers:**

```
Authorization: Bearer {token}
```

**Success Response (200):**

```json
{
    "task": {
        "id": 1,
        "user_id": 1,
        "title": "Complete project documentation",
        "flag": "Ongoing",
        "created_at": "2026-02-28T06:00:00.000000Z",
        "updated_at": "2026-02-28T06:00:00.000000Z"
    }
}
```

**Error Response (403):**

```json
{
    "message": "Unauthorized"
}
```

---

### Update Task

**PUT/PATCH** `/tasks/{id}`

Updates a task's properties (only if it belongs to authenticated user).

**Headers:**

```
Authorization: Bearer {token}
```

**Request Body:**

```json
{
    "title": "Complete project documentation (updated)", // Optional
    "flag": "Complete" // Optional
}
```

**Success Response (200):**

```json
{
    "message": "Task updated successfully",
    "task": {
        "id": 1,
        "user_id": 1,
        "title": "Complete project documentation (updated)",
        "flag": "Complete",
        "created_at": "2026-02-28T06:00:00.000000Z",
        "updated_at": "2026-02-28T06:05:00.000000Z"
    }
}
```

---

### Delete Task

**DELETE** `/tasks/{id}`

Deletes a task (only if it belongs to authenticated user).

**Headers:**

```
Authorization: Bearer {token}
```

**Success Response (200):**

```json
{
    "message": "Task deleted successfully"
}
```

**Error Response (403):**

```json
{
    "message": "Unauthorized"
}
```

---

## Task Flag Values

The `flag` field accepts one of three values:

- `"Ongoing"` - Task is in progress
- `"Due"` - Task is urgent/overdue
- `"Complete"` - Task is finished

---

## Demo Account

For testing purposes, a demo account is seeded in the database:

- **Email:** `demo@example.com`
- **Password:** `password`
- **Tasks:** 8 pre-seeded tasks

---

## Error Responses

### Validation Error (422)

```json
{
    "message": "The title field is required. (and 1 more error)",
    "errors": {
        "title": ["The title field is required."],
        "flag": ["The flag field must be one of: Ongoing, Due, Complete."]
    }
}
```

### Unauthorized (401)

```json
{
    "message": "Unauthenticated."
}
```

### Not Found (404)

```json
{
    "message": "No query results for model [App\\Models\\Task] {id}"
}
```

---

## CORS Configuration

The API is configured to accept requests from:

- `http://localhost:3000` (Next.js development server)
- `http://127.0.0.1:3000`

Credentials and authentication tokens are supported for cross-origin requests.

---

## Testing with cURL

### Register

```bash
curl -X POST http://localhost:8000/api/register \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
```

### Login

```bash
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{"email":"demo@example.com","password":"password"}'
```

### Get Tasks (with token)

```bash
curl -X GET http://localhost:8000/api/tasks \
  -H "Accept: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Create Task

```bash
curl -X POST http://localhost:8000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"title":"New task","flag":"Ongoing"}'
```

### Update Task

```bash
curl -X PUT http://localhost:8000/api/tasks/1 \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"flag":"Complete"}'
```

### Delete Task

```bash
curl -X DELETE http://localhost:8000/api/tasks/1 \
  -H "Accept: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```
