const jwt = require('jsonwebtoken');
const config = require('../config/config');
const AppError = require('../utils/AppError');
const logger = require('../utils/logger');


const authMiddleware = (req, res, next) => {
    try {
        const token = req.cookies?.token || 
                      req.headers.authorization?.replace('Bearer ', '');

        if (!token) {
            logger.warn('Unauthorized access attempt', { 
                ip: req.ip,
                path: req.path 
            });
            throw new AppError('Token not found', 401, 'NO_TOKEN');
        }

        const decoded = jwt.verify(token, config.JWT.SECRET);

        req.user = decoded;

        next();
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            logger.warn('Token expired', { 
                email: req.body?.email,
                ip: req.ip 
            });
            return next(new AppError('Token expired', 401, 'TOKEN_EXPIRED'));
        }

        if (error instanceof jwt.JsonWebTokenError) {
            logger.error('Invalid token', { 
                error: error.message,
                ip: req.ip 
            });
            return next(new AppError('Invalid token', 401, 'INVALID_TOKEN'));
        }

        if (error instanceof AppError) {
            return next(error);
        }

        logger.error('Auth middleware error', { 
            error: error.message,
            stack: error.stack 
        });
        next(new AppError('Authentication failed', 500));
    }
};

module.exports = authMiddleware;