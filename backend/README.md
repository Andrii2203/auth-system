# Backend - Authentication API

Node.js/Express backend with JWT authentication, MySQL database, and comprehensive security features.

## 🛠 Tech Stack

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MySQL** - Relational database
- **JWT** - JSON Web Tokens for authentication
- **bcrypt** - Password hashing
- **express-validator** - Input validation
- **express-rate-limit** - Rate limiting middleware
- **cookie-parser** - Cookie parsing
- **cors** - Cross-Origin Resource Sharing
- **dotenv** - Environment variables

## 📦 Installation

```bash
npm install
```

## ⚙️ Configuration

Create `.env` file in the backend directory:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=auth_system

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRY=1800

# Server Configuration
PORT=5000
NODE_ENV=development

# Security Configuration (optional)
BCRYPT_ROUNDS=10
LOG_LEVEL=info
```

## 🗄️ Database Setup

### Create Database

```sql
CREATE DATABASE auth_system;
USE auth_system;
```

### Create Users Table

```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Verify Table

```sql
DESCRIBE users;
```

## 🚀 Running the Server

### Development Mode (with auto-reload)

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

Server will run on `http://localhost:5000`

## 📁 Project Structure

```
backend/
├── config/
│   ├── config.js          # Centralized configuration
│   └── database.js        # MySQL connection pool
├── controllers/
│   └── authController.js  # Authentication logic
├── middleware/
│   ├── authMiddleware.js  # JWT verification
│   ├── errorHandler.js    # Global error handler
│   ├── validation.js      # Input validation rules
│   └── rateLimiter.js     # Rate limiting config
├── routes/
│   └── auth.js            # Authentication routes
├── utils/
│   ├── logger.js          # Custom logger
│   └── AppError.js        # Custom error class
├── logs/                  # Log files (auto-generated)
├── .env                   # Environment variables
├── server.js              # Application entry point
└── package.json
```

## 🔌 API Endpoints

### Health Check

```
GET /
```

**Response:**
```json
{
  "message": "Auth System API is running",
  "environment": "development",
  "timestamp": "2025-01-20T10:30:00.000Z"
}
```

### Register User

```
POST /api/auth/register
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response (201):**
```json
{
  "message": "User successfully registered",
  "userId": 1
}
```

**Errors:**
- `400` - Validation failed
- `409` - User already exists
- `429` - Too many registration attempts

### Login

```
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response (200):**
```json
{
  "message": "Successfully logged in",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com"
  }
}
```

**Sets Cookie:**
- Name: `token`
- HttpOnly: `true`
- SameSite: `strict`
- MaxAge: `1800000` (30 minutes)

**Errors:**
- `400` - Validation failed
- `401` - Invalid credentials
- `429` - Too many login attempts

### Get Current User

```
GET /api/auth/me
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com"
  }
}
```

**Errors:**
- `401` - Token not found / expired / invalid

### Logout

```
POST /api/auth/logout
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "message": "Successfully logged out"
}
```

## 🔐 Security Features

### 1. Password Security
- **bcrypt** hashing with 10 salt rounds
- Passwords never stored in plain text
- Minimum 6 characters required

### 2. SQL Injection Prevention
- Parameterized queries using `?` placeholders
- mysql2 prepared statements
- No string concatenation in queries

### 3. XSS Protection
- httpOnly cookies (JavaScript cannot access)
- Input validation and sanitization
- express-validator middleware

### 4. CSRF Protection
- SameSite cookie attribute set to `strict`
- Prevents cross-site request forgery

### 5. Rate Limiting
- **Login:** 5 attempts per 15 minutes per email/IP
- **Register:** 10 attempts per hour per IP
- Prevents brute-force attacks

### 6. JWT Security
- 30-minute token expiration
- Signed with secret key
- Verified on every protected route

### 7. Error Handling
- No sensitive data in error messages
- Detailed logs in files (not exposed to client)
- Custom error codes for tracking

## 📊 Logging

Logs are automatically created in `logs/` directory:

- `logs/app.log` - General application logs
- `logs/error.log` - Error logs only

**Log Levels:**
- `error` - Critical errors
- `warn` - Warnings
- `info` - General information
- `debug` - Detailed debug info

**Example Log Entry:**
```json
{
  "timestamp": "2025-01-20T10:30:00.000Z",
  "level": "INFO",
  "message": "User logged in successfully",
  "userId": 1,
  "email": "user@example.com"
}
```

## 🐛 Debugging

### Enable Debug Logs

Set in `.env`:
```env
LOG_LEVEL=debug
```

### Check MySQL Connection

```bash
mysql -u root -p
USE auth_system;
SHOW TABLES;
```

### Common Issues

**1. "Access denied for user 'root'@'localhost'"**
- Check `DB_PASSWORD` in `.env`
- Verify MySQL is running

**2. "Port 5000 already in use"**
- Change `PORT` in `.env`
- Kill existing process: `lsof -ti:5000 | xargs kill`

**3. "Cannot find module"**
- Run `npm install`
- Check file paths in `require()` statements

## 📈 Performance Considerations

### Connection Pooling
- MySQL pool with 10 connections
- Automatic connection management
- Handles concurrent requests efficiently

### Rate Limiting
- In-memory store (sufficient for small apps)
- For production scale, consider Redis

### Async/Await
- All database operations use async/await
- Non-blocking I/O
- Efficient error handling with try/catch

## 🚀 Production Deployment

### Environment Variables
```env
NODE_ENV=production
DB_HOST=your-production-db-host
JWT_SECRET=very_long_random_secret_key
PORT=5000
```

### Recommendations
1. Use **PM2** process manager
2. Enable **HTTPS** (SSL/TLS)
3. Set up **database backups**
4. Implement **monitoring** (Sentry, LogRocket)
5. Use **Redis** for rate limiting
6. Configure **CORS** for production domain

### PM2 Setup

```bash
npm install -g pm2
pm2 start server.js --name "auth-api"
pm2 save
pm2 startup
```

## 📝 Code Quality

### ESLint (optional)

```bash
npm install --save-dev eslint
npx eslint --init
```

### Prettier (optional)

```bash
npm install --save-dev prettier
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -m 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit pull request

## 📄 License

MIT License