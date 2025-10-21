const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const config = require('./config/config');
const logger = require('./utils/logger');
const authRoutes = require('./routes/auth');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(cors({
    origin: config.NODE_ENV === 'production'
        ? process.env.CORS_ORIGIN || 'https://yourdomain.com'
        : 'http://localhost:3000',
    credentials: true,
}));

app.use((req, res, next) => {
    logger.debug(`${req.method} ${req.path}`, {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
    });
    next();
});

app.get('/', (req, res) => {
    res.json({
        message: 'Auth System API is running',
        environment: config.NODE_ENV,
        timestamp: new Date().toISOString(),
    });
});

app.use('/api/auth', authRoutes);

app.use((req, res) => {
    res.status(404).json({
        error: 'Route not found',
        statusCode: 404,
        errorCode: 'NOT_FOUND',
    });
});

app.use(errorHandler);

app.listen(config.PORT, () => {
    logger.info(`🚀 Backend running on http://localhost:${config.PORT}`, {
        environment: config.NODE_ENV,
    });
});

module.exports = app;