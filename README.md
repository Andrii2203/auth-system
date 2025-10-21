# Authentication System

A secure, full-stack authentication system built with Node.js, React, and MySQL.

## 🚀 Features

- **User Registration & Login** with email/password
- **JWT-based Authentication** with 30-minute session expiration
- **Secure Password Hashing** using bcrypt
- **Protected Routes** with automatic token validation
- **Rate Limiting** to prevent brute-force attacks
- **Responsive Design** for mobile and desktop
- **Comprehensive Security** (SQL Injection, XSS, CSRF protection)

## 🛠 Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MySQL** - Database
- **JWT** - Token-based authentication
- **bcrypt** - Password hashing
- **express-validator** - Input validation
- **express-rate-limit** - Rate limiting

### Frontend
- **React** - UI library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **CSS3** - Styling with animations

## 📋 Requirements

- Node.js (v14 or higher)
- MySQL (v8 or higher)
- npm or yarn

## 🔧 Installation

### 1. Clone the repository

```bash
git clone https://github.com/Andrii2203/auth-system.git
cd auth-system
```

### 2. Setup Backend

```bash
cd backend
npm install
```

Create `.env` file:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=auth_system
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRY=1800
PORT=5000
NODE_ENV=development
```

Create MySQL database:

```sql
CREATE DATABASE auth_system;
USE auth_system;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3. Setup Frontend

```bash
cd ../frontend
npm install
```

Create `.env.local` file:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

## 🚀 Running the Application

### Start Backend

```bash
cd backend
npm run dev
```

Backend runs on: `http://localhost:5000`

### Start Frontend

```bash
cd frontend
npm start
```

Frontend runs on: `http://localhost:3000`

## 📁 Project Structure

```
auth-system/
├── backend/
│   ├── config/          # Configuration files
│   ├── controllers/     # Business logic
│   ├── middleware/      # Auth, validation, error handling
│   ├── routes/          # API routes
│   ├── utils/           # Logger, error classes
│   └── server.js        # Entry point
├── frontend/
│   ├── src/
│   │   ├── api/         # API client
│   │   ├── components/  # React components
│   │   ├── context/     # Auth context
│   │   └── hooks/       # Custom hooks
│   └── public/
└── README.md
```

## 🔐 Security Features

1. **Password Security**
   - Bcrypt hashing with 10 salt rounds
   - Minimum 6 character requirement

2. **SQL Injection Prevention**
   - Parameterized queries with prepared statements

3. **XSS Protection**
   - httpOnly cookies for token storage
   - Input sanitization on client and server

4. **CSRF Protection**
   - SameSite cookie attribute set to 'strict'

5. **Rate Limiting**
   - Login: 5 attempts per 15 minutes
   - Registration: 10 attempts per hour

6. **Token Security**
   - JWT with 30-minute expiration
   - Automatic logout on token expiry

## 🌐 API Endpoints

### Authentication

- **POST** `/api/auth/register` - Register new user
- **POST** `/api/auth/login` - Login user
- **POST** `/api/auth/logout` - Logout user
- **GET** `/api/auth/me` - Get current user (protected)

## 🎨 UI Features

- Modern gradient design
- Smooth animations
- Form validation with error messages
- Loading states
- Responsive layout (mobile-first)

## 📝 Trade-offs & Design Decisions

### 1. React vs Next.js
- Chose Create React App for simplicity
- Next.js would add SSR complexity not needed for this auth-only app

### 2. localStorage + httpOnly cookies
- Token stored in both for persistence and security
- localStorage for client-side checks
- httpOnly cookie for secure server communication

### 3. Rate Limiting Strategy
- Implemented at application level (not Redis)
- Sufficient for small-medium apps
- For production scale, consider Redis-based solution

### 4. Monolithic Structure
- Single repo for simplicity
- For production, consider separating backend/frontend repos

### 5. Custom Logger vs Winston
- Built lightweight custom logger
- Winston can be integrated for production needs

## 🚀 Deployment Considerations

### Backend
- Set `NODE_ENV=production`
- Use environment-specific `.env` files
- Enable HTTPS
- Use process manager (PM2)

### Frontend
- Run `npm run build`
- Serve static files via Nginx/Apache
- Update CORS origin

### Database
- Use connection pooling
- Regular backups
- Implement database migrations

## 👤 Author

Your Name - [GitHub](https://github.com/Andrii2203)

## 📄 License

This project is licensed under the MIT License.