const rateLimit = require('express-rate-limit');
const { ipKeyGenerator } = require('express-rate-limit');
const config = require('../config/config');

const loginLimiter = rateLimit({
    windowMs: config.RATE_LIMIT.LOGIN_WINDOW_MS,
    max: config.RATE_LIMIT.LOGIN_MAX_ATTEMPTS,
    message: 'Too many login attempts. Please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => config.NODE_ENV === 'test',
    keyGenerator: (req) => {
        return req.body?.email || ipKeyGenerator(req);
    },
    handler: (req, res) => {
        res.status(429).json({
        error: 'Too many login attempts. Please try again later.',
        statusCode: 429,
        });
    },
});

const registerLimiter = rateLimit({
    windowMs: config.RATE_LIMIT.REGISTER_WINDOW_MS,
    max: config.RATE_LIMIT.REGISTER_MAX_ATTEMPTS,
    message: 'Too many registration attempts. Please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => config.NODE_ENV === 'test',
    handler: (req, res) => {
        res.status(429).json({
        error: 'Too many registration attempts. Please try again later.',
        statusCode: 429,
        });
    },
});

module.exports = {
    loginLimiter,
    registerLimiter,
};