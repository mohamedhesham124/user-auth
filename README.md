# user-auth
User Authentication Service – A backend service for secure user authentication using JWT (JSON Web Tokens). Supports user signup, login, access token generation, refresh tokens for session renewal, and token validation for protected routes.

# User Auth API

A Node.js authentication API with user registration, login, email verification, password reset, and user management.

---

## API Message Format

All API responses follow this format:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": { /* response data or null */ }
}
```

For errors:

```json
{
  "success": false,
  "message": "Error message",
  "data": null
}
```

---

## API Endpoints

### Auth

| Method | Endpoint                       | Description                        | Auth Required | Roles         |
|--------|------------------------------- |------------------------------------|-------------- |-------------- |
| POST   | `/api/v1/auth/signup`          | Register a new user                | No           | -             |
| POST   | `/api/v1/auth/signin`          | Login and get JWT token            | No           | -             |
| GET    | `/api/v1/auth/verify-email`    | Verify email via token             | No           | -             |
| POST   | `/api/v1/auth/forget-password` | Send password reset email          | No           | -             |
| GET    | `/api/v1/auth/reset-password`  | Show reset password form (EJS)     | No           | -             |
| POST   | `/api/v1/auth/change-password` | Change password via reset token    | No           | -             |

### User Management

| Method | Endpoint                | Description           | Auth Required | Roles         |
|--------|------------------------ |---------------------- |-------------- |-------------- |
| GET    | `/api/v1/user/`         | Get all users         | Yes           | Admin         |
| GET    | `/api/v1/user/:id`      | Get user by ID        | Yes           | Admin, User   |
| PUT    | `/api/v1/user/:id`      | Update user           | Yes           | User          |
| DELETE | `/api/v1/user/:id`      | Delete user           | Yes           | Admin, User   |

---

## Example `.env` File

```
PORT=3000
URL=http://localhost:3000
NODE_ENV=development
DB_STRING=mongodb://localhost:27017/user-auth
DB_STRING_PROD=postgres://admin:7788@localhost:5432/user_auth
JWT_SECRET=your_jwt_secret
EMAIL_USER=yourgmail@gmail.com
APP_PASS=secret app pass
```

---

## Notes

- Email verification and password reset links are sent via email and open EJS pages for user interaction.
- All protected endpoints require a valid JWT token in the `Authorization` header as  'x-auth-token' : token.
- Roles: `Admin`, `User` (with `isAdmin` boolean in user model).

---

Post Man 
https://web.postman.co/workspace/My-Workspace~00d5889c-1530-4b97-8f69-9d29c12074d3/request/38134385-cb2a8fc8-2e4c-4cfe-a624-3495d9d7aa7d?action=share&source=copy-link&creator=38134385
