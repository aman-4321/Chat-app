# Chat App Backend API Documentation

## Setup Instructions

### 1. Install Dependencies

```bash
npm install

npm install -D typescript @types/node ts-node tsc-watch
```

### 2. Environment Setup

Create a `.env` file in the root directory and add the following variables:

```bash
DATABASE_URL="postgresql://username:password@localhost:5432/chatapp"
LOCAL_DATABASE_URL="postgresql://username:password@localhost:5432/chatapp"
FRONTEND_URL="http://localhost:3000"
PORT=8081
NODE_ENV="development"
JWT_SECRET="your-super-secret-key"
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

### 3. Database Setup

```bash
npx prisma migrate dev

npm run seed
```

### 4. Start Development Server

```bash
npm run dev
```

## Base URL

- Development: `http://localhost:8081/api/v1`
- Production: Your production URL

## Authentication

- Uses JWT (JSON Web Tokens) for authentication
- Tokens are stored in HTTP-only cookies
- Token expiration: 24 hours
- All protected routes require a valid JWT token in cookies

## Authentication Routes

### 1. Sign Up

- **Route:** `POST /user/signup`
- **Description:** Register a new user
- **Request Body:**

```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

- **Response:**

```json
{
  "message": "User Created Successfully",
  "id": "user-uuid",
  "fullName": "John Doe",
  "email": "john@example.com"
}
```

### 2. Sign In

- **Route:** `POST /user/signin`
- **Description:** Authenticate existing user
- **Request Body:**

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

- **Response:**

```json
{
  "message": "Logged in successfully",
  "userId": "user-uuid",
  "email": "john@example.com"
}
```

### 3. Logout

- **Route:** `POST /user/logout`
- **Description:** Logout user and clear cookie
- **Response:**

```json
{
  "message": "Logged out Successfully"
}
```

### 4. Update Profile

- **Route:** `PUT /user/update-profile`
- **Description:** Update user's profile picture
- **Authentication:** Required
- **Request Body:**

```json
{
  "profilePic": "base64-encoded-image-string"
}
```

- **Response:**

```json
{
  "id": "user-uuid",
  "fullName": "John Doe",
  "email": "john@example.com",
  "profilePic": "cloudinary-image-url"
}
```

### 5. Check Auth

- **Route:** `GET /user/check`
- **Description:** Verify user's authentication status
- **Authentication:** Required
- **Response:**

```json
{
  "id": "user-uuid",
  "email": "john@example.com",
  "fullName": "John Doe",
  "profilePic": "cloudinary-image-url"
}
```

### Protected Routes

The following routes require authentication:

- All `/messages/*` routes
- `/user/update-profile`
- `/user/check`
- `/user/logout`

## Input Validation Requirements

### User Routes

#### 1. Sign Up (`POST /user/signup`)

| Field    | Type   | Required | Validation Rules                                    |
| -------- | ------ | -------- | --------------------------------------------------- |
| fullName | string | Yes      | Min length: 2 characters                            |
| email    | string | Yes      | Valid email format                                  |
| password | string | Yes      | Min length: 6 characters, Max length: 20 characters |

#### 2. Sign In (`POST /user/signin`)

| Field    | Type   | Required | Validation Rules     |
| -------- | ------ | -------- | -------------------- |
| email    | string | Yes      | Valid email format   |
| password | string | Yes      | No length validation |

#### 3. Update Profile (`PUT /user/update-profile`)

| Field      | Type   | Required | Validation Rules            |
| ---------- | ------ | -------- | --------------------------- |
| profilePic | string | Yes      | Base64 encoded image string |

### Message Routes

#### Send Message (`POST /messages/send/:id`)

| Field | Type   | Required | Validation Rules            |
| ----- | ------ | -------- | --------------------------- |
| text  | string | No\*     | -                           |
| image | string | No\*     | Base64 encoded image string |

\*At least one of text or image must be provided

## Cookie Settings

Cookies are set with the following options:

```javascript
{
  httpOnly: true,
  sameSite: "strict",
  secure: true // in production only
}
```

## Message Routes

### 1. Get Users for Sidebar

- **Route:** `GET /messages/users`
- **Description:** Get all users for chat sidebar
- **Authentication:** Required
- **Response:**

```json
[
  {
    "id": "user-uuid",
    "fullName": "Jane Doe",
    "email": "jane@example.com",
    "profilePic": "cloudinary-image-url",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### 2. Get Messages

- **Route:** `GET /messages/:id`
- **Description:** Get conversation messages with specific user
- **Authentication:** Required
- **Params:** `id` (receiver's user ID)
- **Response:**

```json
[
  {
    "id": "message-uuid",
    "senderId": "sender-uuid",
    "receiverId": "receiver-uuid",
    "text": "Hello!",
    "image": "cloudinary-image-url",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### 3. Send Message

- **Route:** `POST /messages/send/:id`
- **Description:** Send message to specific user
- **Authentication:** Required
- **Params:** `id` (receiver's user ID)
- **Request Body:**

```json
{
  "text": "Hello!",
  "image": "base64-encoded-image-string" // optional
}
```

- **Response:**

```json
{
  "id": "message-uuid",
  "senderId": "sender-uuid",
  "receiverId": "receiver-uuid",
  "text": "Hello!",
  "image": "cloudinary-image-url",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "sender": {
    "id": "sender-uuid",
    "fullName": "John Doe"
  },
  "receiver": {
    "id": "receiver-uuid",
    "fullName": "Jane Doe"
  }
}
```

## WebSocket Events

The server supports real-time communication through WebSocket connections:

- **Online Users:** Broadcasts when users connect/disconnect
- **New Messages:** Real-time message delivery to online users

## Error Responses

The API may return the following error status codes:

- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `411` - Length Required
- `500` - Internal Server Error

Each error response includes a message describing the error.

### Validation Errors (Status: 411)

```json
{
  "message": "Invalid inputs",
  "error": {
    "fieldName": ["validation error message"]
  }
}
```

### Authentication Errors (Status: 401)

```json
{
  "message": "Unauthorized - [specific reason]"
}
```

### Server Errors (Status: 500)

```json
{
  "message": "Internal Server Error",
  "error": "[error details]"
}
```
