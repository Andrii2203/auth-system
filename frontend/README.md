# Frontend - Authentication UI

React-based frontend with modern UI, form validation, and protected routes.

## 🛠 Tech Stack

- **React** - UI library
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client
- **Context API** - State management
- **CSS3** - Styling with animations and gradients

## 📦 Installation

```bash
npm install
```

## ⚙️ Configuration

Create `.env.local` file in the frontend directory:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

## 🚀 Running the Application

### Development Mode

```bash
npm start
```

Application will open at `http://localhost:3000`

### Production Build

```bash
npm run build
```

Optimized build will be in `build/` directory.

### Preview Production Build

```bash
npm install -g serve
serve -s build
```

## 📁 Project Structure

```
frontend/
├── public/
│   ├── index.html           # HTML template
│   └── manifest.json        # PWA manifest
├── src/
│   ├── api/
│   │   └── authApi.js       # API client with axios
│   ├── components/
│   │   ├── Login/
│   │   │   ├── Login.jsx    # Login page
│   │   │   └── Login.css    # Login/Register styles
│   │   ├── Register/
│   │   │   └── Register.jsx # Registration page
│   │   ├── Welcome/
│   │   │   ├── Welcome.jsx  # Welcome page (protected)
│   │   │   └── Welcome.css  # Welcome page styles
│   │   └── ProtectedRoute/
│   │       └── ProtectedRoute.jsx # Route guard component
│   ├── context/
│   │   └── AuthContext.jsx  # Global auth state
│   ├── hooks/
│   │   └── useAuth.js       # Custom auth hook
│   ├── App.jsx              # Main app component
│   └── index.js             # Entry point
├── .env.local               # Environment variables
└── package.json
```

## 🎨 Pages & Routes

### Public Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/login` | Login | User login form |
| `/register` | Register | User registration form |
| `/` | - | Redirects to `/login` |

### Protected Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/welcome` | Welcome | User dashboard (requires auth) |

## 🔐 Authentication Flow

### 1. Registration
```
User fills form → Validation → API call → Success message → Redirect to login
```

### 2. Login
```
User fills form → Validation → API call → Store token → Redirect to welcome
```

### 3. Protected Route Access
```
User visits /welcome → Check token → Valid: Show page / Invalid: Redirect to login
```

### 4. Logout
```
User clicks Logout → Clear token → API call → Redirect to login
```

### 5. Session Persistence
```
Page refresh → Check localStorage for token → Verify with API → Restore session
```

## 🧩 Component Architecture

### AuthContext Provider

Global state management for authentication:

```javascript
const { user, loading, error, isAuthenticated, login, register, logout } = useAuth();
```

**State:**
- `user` - Current user object `{ id, email }`
- `loading` - Boolean for async operations
- `error` - Error message string
- `isAuthenticated` - Boolean authentication status

**Methods:**
- `login(email, password)` - Login user
- `register(email, password)` - Register new user
- `logout()` - Logout current user

### ProtectedRoute Component

Guards routes that require authentication:

```jsx
<Route 
  path="/welcome" 
  element={
    <ProtectedRoute>
      <Welcome />
    </ProtectedRoute>
  } 
/>
```

**Behavior:**
- Shows loading spinner while checking auth
- Redirects to `/login` if not authenticated
- Renders children if authenticated

### Login Component

**Features:**
- Email and password inputs
- Real-time validation
- Error display
- Loading state
- Link to registration

**Validation Rules:**
- Email: Valid format required
- Password: Minimum 6 characters

### Register Component

**Features:**
- Email, password, confirm password
- Password matching validation
- Success message
- Auto-redirect after registration

**Validation Rules:**
- Email: Valid format
- Password: Minimum 6 characters
- Confirm Password: Must match password

### Welcome Component

**Features:**
- User avatar with first letter of email
- Greeting message with email
- Logout button
- Session expiry notice

## 🎨 Styling & UX

### Design System

**Colors:**
- Primary: `#667eea` (Purple)
- Secondary: `#764ba2` (Dark Purple)
- Success: `#4caf50` (Green)
- Error: `#e74c3c` (Red)
- Background: Gradient from primary to secondary

**Typography:**
- Font Family: System fonts (Segoe UI, Roboto, etc.)
- Headings: Bold, 24-36px
- Body: Regular, 14-16px

**Spacing:**
- Card padding: 40-60px
- Form gaps: 20px
- Element margins: 8-20px

### Animations

- **Slide In:** Cards animate from bottom on load
- **Fade In:** Elements fade in sequentially
- **Hover Effects:** Buttons lift on hover
- **Loading Spinner:** Rotating border animation
- **Shake:** Input fields shake on error
- **Gradient Shift:** Background gradient animation

### Responsive Design

**Breakpoints:**
- Desktop: > 480px
- Mobile: ≤ 480px

**Mobile Optimizations:**
- Reduced padding
- Smaller font sizes
- Full-width buttons
- Touch-friendly targets (min 44px)

## 📱 Features

### Client-Side Validation

All forms validate before submission:

```javascript
// Email validation
/^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Password validation
password.length >= 6

// Confirm password
password === confirmPassword
```

### Error Handling

**Display Errors:**
- Field-level errors below inputs
- Server errors in alert box
- Network errors with retry suggestion

**Error Types:**
- Validation errors (400)
- Authentication errors (401)
- Server errors (500)
- Network errors

### Loading States

Visual feedback during async operations:
- Disabled inputs during submission
- Button text changes ("Login" → "Logging in")
- Spinner animation

### Token Management

**Storage:**
- Stored in `localStorage` as `authToken`
- Automatically included in API requests
- Cleared on logout or token expiry

**Security:**
- Token sent in Authorization header
- Also sent in httpOnly cookie
- Automatic removal on 401 response

## 🔌 API Integration

### Axios Configuration

```javascript
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' }
});
```

### Request Interceptor

Automatically adds token to requests:

```javascript
config.headers.Authorization = `Bearer ${token}`;
```

### Response Interceptor

Handles 401 errors automatically:

```javascript
if (error.response?.status === 401) {
  localStorage.removeItem('authToken');
  window.location.href = '/login';
}
```

### Console Logs

Enable debug mode in `.env.local`:

```env
REACT_APP_DEBUG=true
```

### Common Issues

**1. "Network Error"**
- Check backend is running on port 5000
- Verify `REACT_APP_API_URL` in `.env.local`
- Check CORS configuration

**2. "Token expired"**
- Token validity is 30 minutes
- Login again to get new token

**3. "Infinite reload"**
- Check AuthContext `useEffect` dependencies
- Verify token in localStorage

## 🚀 Production Deployment

### Build for Production

```bash
npm run build
```

### Environment Variables

Update for production:

```env
REACT_APP_API_URL=https://your-api-domain.com/api
```

## 📊 Performance Optimization

### Image Optimization

- Use WebP format
- Compress images
- Lazy load images

### Bundle Size

Check bundle size:

```bash
npm run build
npx source-map-explorer build/static/js/*.js
```

## ♿ Accessibility

- Semantic HTML elements
- ARIA labels on inputs
- Keyboard navigation support
- Focus indicators
- Color contrast compliance (WCAG AA)

## 📄 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🤝 Contributing

Follow React best practices:
- Functional components with hooks
- PropTypes for type checking
- ESLint for code quality
- Prettier for formatting

## 📝 License

MIT License