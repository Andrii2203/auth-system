require('dotenv').config();

module.exports = {
    PORT: parseInt(process.env.PORT, 10) || 5000,
    NODE_ENV: process.env.NODE_ENV || 'development',

    DB: {
        HOST: process.env.DB_HOST || 'localhost',
        USER: process.env.DB_USER || 'root',
        PASSWORD: process.env.DB_PASSWORD || '',
        NAME: process.env.DB_NAME || 'auth_system',
    },

    JWT: {
        SECRET: process.env.JWT_SECRET || 'your_super_secret_key_change_in_production',
        EXPIRY: process.env.JWT_EXPIRY || '30m',
    },

    SECURITY: {
        BCRYPT_ROUNDS: parseInt(process.env.BCRYPT_ROUNDS, 10) || 10,
        PASSWORD_MIN_LENGTH: 6,
        PASSWORD_MAX_LENGTH: 128,
        EMAIL_MAX_LENGTH: 255,
    },

    RATE_LIMIT: {
        LOGIN_WINDOW_MS: 15 * 60 * 1000,
        LOGIN_MAX_ATTEMPTS: 5,
        REGISTER_WINDOW_MS: 60 * 60 * 1000,
        REGISTER_MAX_ATTEMPTS: 10,
    },

    LOG_LEVEL: process.env.LOG_LEVEL || 'info',
};