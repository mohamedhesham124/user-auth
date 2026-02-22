# 🔔 Notification API Module

A comprehensive, production-ready notification system for the user-auth application based on a flexible PostgreSQL database model supporting multiple delivery channels and notification types.

## 📋 Table of Contents

- [Quick Start](#quick-start)
- [Features](#features)
- [Architecture](#architecture)
- [API Endpoints](#api-endpoints)
- [File Structure](#file-structure)
- [Documentation](#documentation)
- [Examples](#examples)

---

## 🚀 Quick Start

### 1. Database Setup

The notification module uses Sequelize ORM with PostgreSQL. The model will auto-sync when your app starts.

For manual SQL setup, see [MIGRATION.sql](./MIGRATION.sql)

```javascript
// In your app initialization
const Notification = require('./src/api/notification/notification.model');
await Notification.sync({ alter: true });
```

### 2. Start Using the API

The API is automatically registered at `/api/v1/notifications` once the app starts.

**Get unread notification count:**
```bash
curl -X GET http://localhost:5000/api/v1/notifications/unread/count \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Get all notifications:**
```bash
curl -X GET http://localhost:5000/api/v1/notifications \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Mark notification as read:**
```bash
curl -X PUT http://localhost:5000/api/v1/notifications/{ID}/read \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 3. Integrate with Your Services

```javascript
// In any service (e.g., user follow, messaging, etc.)
const NotificationService = require('../api/notification/notification.service');
const notifService = new NotificationService();

// Create notification
await notifService.createNotification(
  userId,
  'new_follower',
  {
    follower_name: 'John',
    follower_id: 'uuid',
    profile_url: '/users/john'
  }
);
```

---

## ✨ Features

### Core Features

- ✅ **Flexible Notification Types**: Support any notification type (new_follower, message, system_alert, etc.)
- ✅ **Flexible Data Structure**: JSONB data field for any metadata
- ✅ **Multi-Channel Delivery**: Track email, push, SMS, and in-app delivery status
- ✅ **Read Status Tracking**: Mark notifications as read/unread
- ✅ **Pagination Support**: Efficient handling of large notification lists
- ✅ **Full-Text Search**: Filter by type, status, date range
- ✅ **Bulk Operations**: Mark multiple notifications as read at once
- ✅ **User Isolation**: Each user sees only their notifications
- ✅ **Admin Controls**: Cleanup old notifications, system-wide alerts

### Security Features

- 🔐 Authentication required for all endpoints
- 🔐 User-level isolation (users can only access their own notifications)
- 🔐 Admin-only operations for system alerts and maintenance
- 🔐 Input validation using Joi schemas
- 🔐 SQL injection prevention via Sequelize ORM

### Performance Features

- ⚡ Database indexes on common queries
- ⚡ Pagination for efficient data retrieval
- ⚡ Support for caching and batching
- ⚡ Optimized queries with selective field inclusion

---

## 🏗️ Architecture

### Database Schema

```
notifications
├── id (UUID, PK)
├── user_id (UUID, FK → users.id)
├── type (VARCHAR(50)) - notification type
├── data (JSONB) - flexible payload
├── read_at (TIMESTAMP) - read status
├── delivery_meta (JSONB) - channel delivery tracking
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)
```

### Layered Architecture

```
Route Handler (Express)
    ↓
Controller (Request/Response)
    ↓
Service (Business Logic)
    ↓
Repository (Data Access)
    ↓
Model (Sequelize ORM)
    ↓
Database (PostgreSQL)
```

### File Structure

```
src/api/notification/
├── notification.model.js          # Sequelize model (DB schema)
├── notification.repository.js     # Data access layer
├── notification.service.js        # Business logic
├── notification.controller.js     # Request handlers
├── notification.route.js          # Express routes
├── notification.validation.js     # Joi schemas
├── README.md                      # This file
├── NOTIFICATION_API.md            # Full API documentation
├── NOTIFICATION_SETUP.md          # Setup & integration guide
├── EXAMPLES.md                    # Code examples & patterns
└── MIGRATION.sql                  # Database migration script
```

---

## 📡 API Endpoints

### Quick Reference

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/notifications` | Create notification | Admin |
| GET | `/notifications` | Get user notifications | Required |
| GET | `/notifications/unread` | Get unread notifications | Required |
| GET | `/notifications/unread/count` | Get unread count | Required |
| GET | `/notifications/type/:type` | Get by type | Required |
| GET | `/notifications/:id` | Get single notification | Required |
| PUT | `/notifications/:id/read` | Mark as read | Required |
| PUT | `/notifications/read/multiple` | Mark multiple as read | Required |
| PUT | `/notifications/read/all` | Mark all as read | Required |
| PATCH | `/notifications/:id/delivery` | Update delivery status | Admin |
| DELETE | `/notifications/:id` | Delete notification | Required |
| POST | `/notifications/cleanup` | Delete old notifications | Admin |

### Example Request/Response

**POST Create Notification:**
```bash
curl -X POST http://localhost:5000/api/v1/notifications \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "550e8400-e29b-41d4-a716-446655440000",
    "type": "new_follower",
    "data": {
      "follower_name": "John Doe",
      "profile_url": "/users/john"
    },
    "delivery_meta": {
      "email": "pending",
      "push": "pending"
    }
  }'
```

**Response:**
```json
{
  "statusCode": 201,
  "message": "Notification created successfully",
  "data": {
    "id": "660e8400-e29b-41d4-a716-446655440111",
    "user_id": "550e8400-e29b-41d4-a716-446655440000",
    "type": "new_follower",
    "data": {
      "follower_name": "John Doe",
      "profile_url": "/users/john"
    },
    "read_at": null,
    "delivery_meta": {
      "email": "pending",
      "push": "pending"
    },
    "created_at": "2026-02-13T10:00:00Z",
    "updated_at": "2026-02-13T10:00:00Z"
  }
}
```

---

## 📚 Documentation

### Complete Guides

1. **[NOTIFICATION_API.md](./NOTIFICATION_API.md)** - Full API documentation
   - All endpoints with request/response examples
   - Error handling
   - Field descriptions
   - Best practices

2. **[NOTIFICATION_SETUP.md](./NOTIFICATION_SETUP.md)** - Setup & integration guide
   - Installation & configuration
   - Database synchronization
   - Common use cases
   - Performance optimization
   - Testing

3. **[EXAMPLES.md](./EXAMPLES.md)** - Code examples & patterns
   - Basic CRUD operations
   - Real-world integration examples (followers, messaging, etc.)
   - React & Vue component examples
   - Email & push notification integration
   - Queue-based delivery system

4. **[MIGRATION.sql](./MIGRATION.sql)** - Database migration script
   - Table creation SQL
   - Index creation
   - Useful queries
   - Maintenance commands

---

## 🛠️ Common Integration Patterns

### 1. Notify User on New Follower

```javascript
const NotificationService = require('../api/notification/notification.service');
const service = new NotificationService();

// When user A follows user B
const follower = await getUserById(followerUserId);
await service.createNotification(
  followeeUserId,
  'new_follower',
  {
    follower_id: followerUserId,
    follower_name: follower.name,
    profile_url: `/users/${followerUserId}`
  }
);
```

### 2. Notify on Direct Message

```javascript
await service.createNotification(
  recipientUserId,
  'new_message',
  {
    sender_id: senderUserId,
    sender_name: sender.name,
    message_preview: message.substring(0, 100),
    conversation_id: conversationId
  },
  { email: 'pending', push: 'pending' }
);
```

### 3. System-Wide Alert

```javascript
const users = await User.findAll({ where: { isVerified: true } });

for (const user of users) {
  await service.createNotification(
    user.id,
    'system_alert',
    {
      title: 'Maintenance Notice',
      description: 'System maintenance on Feb 15'
    }
  );
}
```

### 4. Get Unread Count for Dashboard

```javascript
// In React
const [unreadCount, setUnreadCount] = useState(0);

useEffect(() => {
  fetch('/api/v1/notifications/unread/count', {
    headers: { 'Authorization': `Bearer ${token}` }
  })
    .then(r => r.json())
    .then(({ data }) => setUnreadCount(data.unreadCount));
}, []);

return <span className="badge">{unreadCount}</span>;
```

---

## 🔧 Configuration

### Environment Variables (Optional)

```env
# Notification settings
NOTIFICATION_CLEANUP_DAYS=30
NOTIFICATION_RETENTION_MONTHS=6
NOTIFICATION_MAX_PAGE_SIZE=100

# Email settings (if integrating email delivery)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Push notification settings
FIREBASE_CREDENTIALS_PATH=./firebase-credentials.json
```

### Customize Notification Types

Add application-specific types to your codebase:

```javascript
// src/constants/notification-types.js
module.exports = {
  TYPES: {
    NEW_FOLLOWER: 'new_follower',
    NEW_MESSAGE: 'new_message',
    NEW_COMMENT: 'new_comment',
    SYSTEM_ALERT: 'system_alert',
    SECURITY_ALERT: 'security_alert',
    ACCOUNT_UPDATE: 'account_update'
  }
};
```

---

## 📊 Database Indexes

The system automatically creates indexes for optimal performance:

```
idx_notifications_user_id          → Fast user queries
idx_notifications_user_unread      → Fast unread queries
idx_notifications_type             → Fast type filtering
idx_notifications_created_at       → Fast recent notifications
idx_notifications_user_type_created → Optimized combined queries
```

---

## 🧪 Testing

### Unit Test Example

```javascript
const NotificationService = require('./notification.service');

describe('NotificationService', () => {
  let service;
  
  beforeEach(() => {
    service = new NotificationService();
  });

  test('should create notification', async () => {
    const notif = await service.createNotification(
      userId,
      'test',
      { test: true }
    );
    expect(notif.id).toBeDefined();
  });

  test('should get user notifications', async () => {
    const result = await service.getUserNotifications(userId);
    expect(result.notifications).toBeInstanceOf(Array);
    expect(result.pagination).toBeDefined();
  });

  test('should mark as read', async () => {
    const notif = await service.markNotificationAsRead(notificationId);
    expect(notif.read_at).not.toBeNull();
  });
});
```

---

## 🚨 Error Handling

The API returns consistent error responses:

```json
{
  "statusCode": 400,
  "message": "user_id and type are required"
}
```

Common status codes:
- **400** - Bad Request (validation error)
- **401** - Unauthorized (missing/invalid token)
- **403** - Forbidden (insufficient permissions)
- **404** - Not Found (notification doesn't exist)
- **500** - Internal Server Error

---

## 📈 Performance Tips

1. **Use Pagination**: Always limit result sets with `limit` parameter
2. **Use Indexes**: Let the database use indexes for filtering
3. **Cache Unread Count**: Cache in Redis for frequently accessed endpoints
4. **Batch Queries**: Mark multiple as read instead of one by one
5. **Cleanup Old Data**: Run cleanup job monthly to maintain performance

---

## 🔐 Security Checklist

- ✅ All endpoints require JWT authentication
- ✅ Users can only access their own notifications
- ✅ Admin-only endpoints are protected
- ✅ All inputs validated with Joi
- ✅ Sequelize ORM prevents SQL injection
- ✅ Rate limiting recommended on high-volume endpoints
- ✅ Database backups recommended for production

---

## 🎯 Roadmap

Future enhancements:
- [ ] WebSocket real-time notifications
- [ ] Notification preferences per user
- [ ] Scheduled notifications
- [ ] Notification templates
- [ ] Analytics dashboard
- [ ] A/B testing for notification content
- [ ] AI-powered notification timing

---

## 📞 Support

For issues or questions:

1. Check [NOTIFICATION_API.md](./NOTIFICATION_API.md) for endpoint details
2. See [EXAMPLES.md](./EXAMPLES.md) for integration patterns
3. Review [NOTIFICATION_SETUP.md](./NOTIFICATION_SETUP.md) for troubleshooting

---

## 📄 License

Same as parent project

---

## 📝 Summary

The Notification API provides a flexible, scalable, and secure foundation for any notification system. It supports multiple notification types, tracks delivery status across channels, and integrates seamlessly with your existing user-auth application.

**Key Benefits:**
- 🎯 Easy to understand and integrate
- 🔒 Enterprise-grade security
- ⚡ High performance with indexing
- 📦 Production-ready code
- 📚 Comprehensive documentation

**Get started in 3 steps:**
1. Sync database model
2. Make API calls to `/api/v1/notifications`
3. Integrate with your business logic

Happy notifying! 🎉

