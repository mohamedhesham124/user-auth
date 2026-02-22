# User Auth Project - Complete Documentation

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Installation & Setup](#installation--setup)
3. [Database Schema](#database-schema)
4. [API Endpoints](#api-endpoints)
5. [Notification System](#notification-system)
6. [Features & Scenarios](#features--scenarios)
7. [Project Structure](#project-structure)
8. [Usage Examples](#usage-examples)

---

## 🎯 Project Overview

This is a **User Authentication & Team Management System** with automatic notifications. The system allows users to:

- Register and verify email
- Follow other users
- Create and manage teams
- Manage files and analyze data
- Receive automatic notifications for important events

**Key Features:**
- ✅ JWT-based authentication
- ✅ Email verification
- ✅ Follow/Unfollow system
- ✅ Team management with roles
- ✅ File upload & data analysis
- ✅ Automatic event-based notifications
- ✅ Multi-channel notification delivery (email, push, in-app)

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js v14+
- PostgreSQL database
- npm or yarn

### Steps

1. **Clone and Install**
```bash
git clone <repo>
cd user-auth
npm install
```

2. **Create `.env` file**
```env
DATABASE_URL=postgresql://user:password@localhost:5432/user_auth
JWT_SECRET=your_secret_key_here
URL=http://localhost:5000
NODE_ENV=development
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_password
```

3. **Initialize Database**
```bash
npm run migrate  # or sync models with database
```

4. **Start Server**
```bash
npm start
```

Server runs on `http://localhost:5000`

---

## 🗄️ Database Schema

### Users Table
```sql
id (UUID, PK)
name (VARCHAR)
email (VARCHAR, UNIQUE)
password (VARCHAR, hashed)
isVerified (BOOLEAN, default: false)
role (ENUM: 'Admin', 'User')
created_at (TIMESTAMP)
updated_at (TIMESTAMP)
```

### Follows Table
```sql
id (UUID, PK)
follower_id (UUID, FK → users.id)
followee_id (UUID, FK → users.id)
created_at (TIMESTAMP)
updated_at (TIMESTAMP)
UNIQUE(follower_id, followee_id)
```

### Teams Table
```sql
team_id (INTEGER, PK, auto-increment)
name (VARCHAR)
description (TEXT)
created_at (TIMESTAMP)
```

### TeamMembers Table
```sql
team_id (INTEGER, PK, FK → teams.team_id)
user_id (UUID, PK, FK → users.id)
role_id (INTEGER, FK → roles.role_id)
```

### Notifications Table
```sql
id (UUID, PK)
user_id (UUID, FK → users.id)
type (VARCHAR(50))
data (JSONB)
read_at (TIMESTAMP, nullable)
delivery_meta (JSONB)
created_at (TIMESTAMP)
updated_at (TIMESTAMP)
```

### Files Table
```sql
id (UUID, PK)
userId (UUID, FK → users.id)
originalFilename (VARCHAR)
storagePath (VARCHAR)
mimetype (VARCHAR)
sizeInBytes (INTEGER)
backupStoragePath (VARCHAR, nullable)
status (VARCHAR)
created_at (TIMESTAMP)
updated_at (TIMESTAMP)
```

### AnalysisResults Table
```sql
id (UUID, PK)
fileId (UUID, FK → files.id)
metadata (JSONB)
summaryStatistics (JSONB)
missingValues (JSONB)
uniqueValues (JSONB)
status (VARCHAR: 'PENDING', 'COMPLETED', 'FAILED')
errorMessage (TEXT, nullable)
created_at (TIMESTAMP)
updated_at (TIMESTAMP)
```

---

## 🔌 API Endpoints

### Authentication Endpoints

#### 1. Register User
```
POST /api/v1/auth/signup
```
**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```
**Response:** User created, verification email sent

---

#### 2. Verify Email
```
GET /api/v1/auth/verify-email?token=<JWT_TOKEN>
```
**Response:** Email verified, notification created

---

#### 3. Sign In
```
POST /api/v1/auth/signin
```
**Body:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```
**Response:**
```json
{
  "token": "jwt_token_here",
  "user": { "id", "name", "email", "role" }
}
```

---

#### 4. Forget Password
```
POST /api/v1/auth/forget-password
```
**Body:**
```json
{
  "email": "john@example.com"
}
```
**Response:** Reset email sent

---

#### 5. Change Password
```
POST /api/v1/auth/change-password
```
**Body:**
```json
{
  "token": "reset_token",
  "newPassword": "newPassword123"
}
```

---

### User Endpoints

#### 1. Get All Users
```
GET /api/v1/users
```
**Response:** List of all users

---

#### 2. Get User by ID
```
GET /api/v1/users/:id
```
**Response:** Single user object

---

#### 3. Update User
```
PUT /api/v1/users/:id
```
**Body:**
```json
{
  "name": "Updated Name",
  "email": "newemail@example.com"
}
```

---

#### 4. Delete User
```
DELETE /api/v1/users/:id
```

---

### Follow System Endpoints

#### 1. Follow a User
```
POST /api/v1/users/:followeeId/follow
Authorization: Bearer <JWT>
```
**Response:** Follow created + notification sent to followee

---

#### 2. Unfollow a User
```
DELETE /api/v1/users/:followeeId/follow
Authorization: Bearer <JWT>
```

---

#### 3. Get User's Followers
```
GET /api/v1/users/:userId/followers?page=1&limit=20
Authorization: Bearer <JWT>
```

---

#### 4. Get User's Following
```
GET /api/v1/users/:userId/following?page=1&limit=20
Authorization: Bearer <JWT>
```

---

#### 5. Check if Following
```
GET /api/v1/users/:followerId/is-following/:followeeId
Authorization: Bearer <JWT>
```

---

### Team Endpoints

#### 1. Create Team
```
POST /api/v1/teams
Authorization: Bearer <JWT>
```
**Body:**
```json
{
  "name": "Development Team",
  "description": "Core development team"
}
```

---

#### 2. Get All Teams
```
GET /api/v1/teams
Authorization: Bearer <JWT>
```

---

#### 3. Get Team by ID
```
GET /api/v1/teams/:team_id
Authorization: Bearer <JWT>
```

---

#### 4. Update Team
```
PUT /api/v1/teams/:team_id
Authorization: Bearer <JWT>
```

---

#### 5. Delete Team
```
DELETE /api/v1/teams/:team_id
Authorization: Bearer <JWT>
```

---

#### 6. Add Team Member
```
POST /api/v1/teams/:team_id/members
Authorization: Bearer <JWT>
```
**Body:**
```json
{
  "email": "user@example.com",
  "roleName": "Editor"
}
```
**Response:** User added + notification sent to new member

---

#### 7. Remove Team Member
```
DELETE /api/v1/teams/:team_id/members/:user_id
Authorization: Bearer <JWT>
```
**Response:** User removed + notification sent

---

#### 8. Get Team Members
```
GET /api/v1/teams/:team_id/members
Authorization: Bearer <JWT>
```

---

### Notification Endpoints

#### 1. Get All Notifications
```
GET /api/v1/notifications?page=1&limit=20
Authorization: Bearer <JWT>
```
**Response:** User's notifications with pagination

---

#### 2. Get Unread Notifications
```
GET /api/v1/notifications/unread?page=1&limit=20
Authorization: Bearer <JWT>
```

---

#### 3. Get Unread Count
```
GET /api/v1/notifications/unread/count
Authorization: Bearer <JWT>
```
**Response:**
```json
{
  "unreadCount": 5
}
```

---

#### 4. Get Notifications by Type
```
GET /api/v1/notifications/type/:type?page=1&limit=20
Authorization: Bearer <JWT>
```
**Types:** `new_follower`, `email_verified`, `added_to_team`, `removed_from_team`, `new_feature`, etc.

---

#### 5. Get Single Notification
```
GET /api/v1/notifications/:id
Authorization: Bearer <JWT>
```

---

#### 6. Mark as Read
```
PUT /api/v1/notifications/:id/read
Authorization: Bearer <JWT>
```

---

#### 7. Mark Multiple as Read
```
PUT /api/v1/notifications/read/multiple
Authorization: Bearer <JWT>
```
**Body:**
```json
{
  "notificationIds": ["id1", "id2", "id3"]
}
```

---

#### 8. Mark All as Read
```
PUT /api/v1/notifications/read/all
Authorization: Bearer <JWT>
```

---

#### 9. Delete Notification
```
DELETE /api/v1/notifications/:id
Authorization: Bearer <JWT>
```

---

### File Endpoints

#### 1. Upload File
```
POST /api/v1/files/upload
Authorization: Bearer <JWT>
Content-Type: multipart/form-data
```
**Form Data:** `file` (binary)

---

#### 2. Get User's Files
```
GET /api/v1/files
Authorization: Bearer <JWT>
```

---

#### 3. Get File by ID
```
GET /api/v1/files/:id
Authorization: Bearer <JWT>
```

---

#### 4. Delete File
```
DELETE /api/v1/files/:id
Authorization: Bearer <JWT>
```

---

### Process/Analysis Endpoints

#### 1. Analyze File
```
POST /api/v1/process/analyze/:fileId
Authorization: Bearer <JWT>
```
**Response:** Analysis results with metadata, statistics, missing values

---

#### 2. Handle Missing Values
```
POST /api/v1/process/handle-missing/:fileId
Authorization: Bearer <JWT>
```
**Body:**
```json
{
  "column": "age",
  "strategy": "mean|median|mode|fill|drop",
  "fillValue": 0
}
```

---

#### 3. Normalize Column Names
```
POST /api/v1/process/normalize/:fileId
Authorization: Bearer <JWT>
```

---

#### 4. Rollback File
```
POST /api/v1/process/rollback/:fileId
Authorization: Bearer <JWT>
```

---

## 🔔 Notification System

### Automatic Notification Scenarios

#### 1. **New Follower Notification**
**When:** User A follows User B
**Type:** `new_follower`
**Recipient:** User B
**Data:**
```json
{
  "follower_id": "uuid",
  "follower_name": "John Doe",
  "follower_email": "john@example.com",
  "profile_url": "/users/uuid"
}
```
**Message:** Auto-generated or custom

---

#### 2. **Email Verification Notification**
**When:** User verifies their email address
**Type:** `email_verified`
**Recipient:** The user who verified
**Data:**
```json
{
  "email": "user@example.com",
  "verified_at": "2026-02-23T10:00:00Z",
  "message": "Your email has been successfully verified!"
}
```

---

#### 3. **Added to Team Notification**
**When:** Team owner adds a user to team
**Type:** `added_to_team`
**Recipient:** The added user
**Data:**
```json
{
  "team_id": 1,
  "team_name": "Development Team",
  "team_description": "Core team",
  "role": "Editor",
  "message": "You have been added to the team \"Development Team\""
}
```

---

#### 4. **Removed from Team Notification**
**When:** Team owner removes a user from team
**Type:** `removed_from_team`
**Recipient:** The removed user
**Data:**
```json
{
  "team_id": 1,
  "team_name": "Development Team",
  "message": "You have been removed from the team \"Development Team\""
}
```

---

#### 5. **System Broadcast Notifications**
**When:** Admin broadcasts feature update, maintenance, etc.
**Types:** `new_feature`, `feature_update`, `maintenance`, `security_update`, `bug_fix`, etc.
**Recipients:** All verified users
**Data Example:**
```json
{
  "feature_name": "Dark Mode",
  "feature_description": "New dark theme available",
  "message": "🎉 New Feature: Dark Mode"
}
```

---

### Notification Object Structure
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "type": "new_follower",
  "data": {
    "follower_name": "John",
    "message": "John followed you"
  },
  "read_at": null,
  "delivery_meta": {
    "email": "pending",
    "push": "pending",
    "in_app": "delivered"
  },
  "created_at": "2026-02-23T10:00:00Z",
  "updated_at": "2026-02-23T10:00:00Z"
}
```

---

### Delivery Status Values
- `pending` - Queued for delivery
- `sent` - Successfully sent
- `failed` - Failed to send
- `skipped` - Intentionally not sent
- `bounced` - Email bounced

---

## 📦 Features & Scenarios

### User Registration Flow
```
1. User calls POST /api/v1/auth/signup
2. System creates user (isVerified = false)
3. System sends verification email
4. User clicks verification link
5. System marks email as verified → EMAIL_VERIFIED notification created
```

### Follow Flow
```
1. User A calls POST /api/v1/users/B_ID/follow
2. System creates follow relationship
3. NEW_FOLLOWER notification created for User B
4. User B receives notification immediately
```

### Team Addition Flow
```
1. Team owner calls POST /api/v1/teams/ID/members
2. System adds user to team
3. ADDED_TO_TEAM notification created for new member
4. New member receives notification
5. User sees in notifications list with team details
```

### System Feature Broadcast
```
1. Admin broadcasts new feature (via internal service call)
2. System calls broadcastToAllUsers('new_feature', {...})
3. Notification created for EVERY verified user
4. All users see notification in their list
```

---

## 📁 Project Structure

```
src/
├── api/
│   ├── auth/
│   │   ├── auth.controller.js
│   │   ├── auth.service.js
│   │   ├── auth.route.js
│   │   └── auth.validation.js
│   ├── user/
│   │   ├── user.model.js
│   │   ├── user.repository.js
│   │   ├── user.service.js
│   │   ├── follow.model.js        ← New
│   │   ├── follow.repository.js   ← New
│   │   └── user.route.js
│   ├── notification/
│   │   ├── notification.model.js
│   │   ├── notification.repository.js
│   │   ├── notification.service.js
│   │   ├── notification.controller.js
│   │   ├── notification.route.js
│   │   ├── notification.validation.js
│   │   └── NOTIFICATION_API.md
│   ├── team/
│   │   ├── team.model.js
│   │   ├── team.repository.js
│   │   ├── team.service.js
│   │   ├── team.controller.js
│   │   ├── team.route.js
│   │   ├── teamMember.model.js
│   │   └── team.validation.js
│   ├── file/
│   │   ├── file.model.js
│   │   ├── file.repository.js
│   │   ├── file.service.js
│   │   ├── file.controller.js
│   │   ├── file.route.js
│   │   └── file.validation.js
│   └── process/
│       ├── process.model.js
│       ├── process.repository.js
│       ├── process.service.js
│       ├── process.controller.js
│       ├── process.route.js
│       └── process.validation.js
├── config/
│   └── database.js
├── middlewares/
│   ├── auth.middleware.js
│   ├── error.handler.js
│   ├── validate.js
│   ├── upload.js
│   └── async.handler.js
├── utils/
│   ├── ApiResponse.js
│   ├── bcrypt.js
│   ├── mailer.js
│   └── dataframe-wrapper.js
├── app.js
└── index.js
```

---

## 💡 Usage Examples

### Example 1: User Registration with Email Verification
```javascript
// 1. User registers
POST /api/v1/auth/signup
{
  "name": "Alice",
  "email": "alice@example.com",
  "password": "secure123"
}

// 2. System sends verification email
// 3. User clicks link: /api/v1/auth/verify-email?token=JWT_TOKEN

// 4. User receives EMAIL_VERIFIED notification:
{
  "type": "email_verified",
  "data": {
    "email": "alice@example.com",
    "message": "Your email has been successfully verified!"
  }
}
```

---

### Example 2: Following User Flow
```javascript
// User John (id: uuid-john) follows User Alice (id: uuid-alice)

POST /api/v1/users/uuid-alice/follow
Authorization: Bearer <JWT>

// Result:
// 1. Follow relationship created
// 2. Alice receives NEW_FOLLOWER notification:
{
  "type": "new_follower",
  "data": {
    "follower_name": "John",
    "follower_id": "uuid-john",
    "profile_url": "/users/uuid-john"
  }
}

// 3. Alice checks notifications:
GET /api/v1/notifications
// See John's follow notification
```

---

### Example 3: Team Member Addition
```javascript
// Team owner adds user to team

POST /api/v1/teams/1/members
Authorization: Bearer <JWT>
{
  "email": "bob@example.com",
  "roleName": "Editor"
}

// Result:
// 1. Bob added to team
// 2. Bob receives ADDED_TO_TEAM notification:
{
  "type": "added_to_team",
  "data": {
    "team_name": "Development Team",
    "role": "Editor",
    "message": "You have been added to the team \"Development Team\""
  }
}

// 3. Bob can now see notifications:
GET /api/v1/notifications/type/added_to_team
// See team invitation
```

---

### Example 4: System Broadcast (Feature Release)
```javascript
// Internal call from admin dashboard or cron job:

const notificationService = new NotificationService();

await notificationService.broadcastToAllUsers(
  'new_feature',
  {
    feature_name: 'Dark Mode',
    feature_description: 'Toggle dark theme in settings',
    enabled_at: new Date().toISOString()
  },
  { email: 'pending', push: 'pending', in_app: 'delivered' }
);

// Result:
// Every verified user receives:
{
  "type": "new_feature",
  "data": {
    "feature_name": "Dark Mode",
    "message": "🎉 New Feature: Dark Mode"
  }
}
```

---

### Example 5: Check Unread Notifications
```javascript
// Get unread count
GET /api/v1/notifications/unread/count
Authorization: Bearer <JWT>

Response:
{
  "unreadCount": 5
}

// Get unread notifications
GET /api/v1/notifications/unread
Authorization: Bearer <JWT>

Response:
{
  "notifications": [
    {
      "id": "uuid",
      "type": "new_follower",
      "data": { "follower_name": "John", ... },
      "read_at": null
    },
    ...
  ],
  "pagination": { "total": 5, "page": 1, "limit": 20, "pages": 1 }
}

// Mark all as read
PUT /api/v1/notifications/read/all
Authorization: Bearer <JWT>
```

---

## 🔐 Security Notes

1. **JWT Authentication** - All endpoints (except auth) require Bearer token
2. **Password Hashing** - Bcrypt with 10 salt rounds
3. **Email Verification** - Token expires in default JWT expiry
4. **User Isolation** - Users can only access their own notifications
5. **Role-based Access** - Only admins can perform certain actions
6. **SQL Injection Prevention** - Using Sequelize ORM

---

## 🐛 Error Handling

All errors follow this format:
```json
{
  "statusCode": 400,
  "message": "Error description",
  "success": false
}
```

Common error codes:
- `400` - Bad request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not found
- `409` - Conflict (duplicate email, already following, etc.)
- `500` - Server error

---

## 📝 Common Workflows

### Workflow 1: Complete User Journey
```
1. Sign up → Email sent
2. Verify email → Email verified notification
3. View profile
4. Follow another user → Follower gets notification
5. Create team
6. Invite team members → Members get notifications
7. Upload file
8. Analyze file
9. View notifications
```

### Workflow 2: Team Collaboration
```
1. Create team
2. Invite users (each user gets added_to_team notification)
3. Upload files to team
4. Analyze data
5. Manage roles
6. Remove members (removed_from_team notification)
```

---

## 🛠️ Maintenance

### Cleanup Old Notifications
```javascript
// Can be called from cron job (internal, no API endpoint)
await notificationService.cleanupOldNotifications(30); // 30 days
```

### Monitor Database
- Check `/notifications` table size
- Archive old notifications if needed
- Monitor query performance

---

## 📞 Support

For issues or questions:
1. Check the API documentation above
2. Review error messages
3. Check request body format
4. Verify JWT token is valid
5. Check database connection

---

**Last Updated:** February 23, 2026
**Version:** 1.0.0
