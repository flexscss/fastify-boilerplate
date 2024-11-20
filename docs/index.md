# API Documentation

## Authentication Routes

### Basic Authentication

#### Register User
- **POST** `/api/v1/auth/basic/register`
- **Request Body:**
  ```json
  {
    "name": "string",
    "email": "string",
    "password": "string"
  }
  ```
- **Responses:**
  - **200 OK**: User registered successfully.
  - **400 Bad Request**: Validation errors.

#### Login User
- **POST** `/api/v1/auth/basic/login`
- **Request Body:**
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Responses:**
  - **200 OK**: User logged in successfully.
  - **401 Unauthorized**: Invalid credentials.

#### Get User Sessions
- **GET** `/api/v1/auth/basic/sessions`
- **Headers:**
  - `Authorization: Bearer <token>`
- **Responses:**
  - **200 OK**: Returns user sessions.
  - **401 Unauthorized**: Invalid token.

#### Close Current User Session
- **GET** `/api/v1/auth/basic/sessions/close`
- **Headers:**
  - `Authorization: Bearer <token>`
- **Responses:**
  - **200 OK**: Session closed successfully.
  - **401 Unauthorized**: Invalid token.

#### Close All User Sessions
- **GET** `/api/v1/auth/basic/sessions/close-all`
- **Headers:**
  - `Authorization: Bearer <token>`
- **Responses:**
  - **200 OK**: All sessions closed successfully.
  - **401 Unauthorized**: Invalid token.

### Telegram Authentication

#### Telegram Login
- **POST** `/api/v1/auth/telegram/login`
- **Request Body:**
  ```json
  {
    "data": "string" // Telegram data
  }
  ```
- **Responses:**
  - **200 OK**: User logged in successfully.
  - **400 Bad Request**: Invalid data.
