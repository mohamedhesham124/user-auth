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

### Auth & User

| Method | Endpoint                       | Description                        | Auth Required | Roles         |
|--------|------------------------------- |------------------------------------|-------------- |-------------- |
| POST   | `/api/v1/user/signup`          | Register a new user                | No           | -             |
| POST   | `/api/v1/user/signin`          | Login and get JWT token            | No           | -             |
| GET    | `/api/v1/user/verify-email`    | Verify email via token             | No           | -             |
| POST   | `/api/v1/user/forget-password` | Send password reset email          | No           | -             |
| GET    | `/api/v1/user/reset-password`  | Show reset password form (EJS)     | No           | -             |
| POST   | `/api/v1/user/change-password` | Change password via reset token    | No           | -             |

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
MONGO_URI=mongodb://localhost:27017/your-db-name
JWT_SECRET=your_jwt_secret
URL=http://localhost:3000
EMAIL_USER=your@email.com
EMAIL_PASS=your_email_password
```

---

## Notes

- Email verification and password reset links are sent via email and open EJS pages for user interaction.
- All protected endpoints require a valid JWT token in the `Authorization` header as `Bearer <token>`.
- Roles: `Admin`, `User` (with `isAdmin` boolean in user model).

---

Post Man 
https://web.postman.co/workspace/My-Workspace~00d5889c-1530-4b97-8f69-9d29c12074d3/request/38134385-cb2a8fc8-2e4c-4cfe-a624-3495d9d7aa7d?action=share&source=copy-link&creator=38134385