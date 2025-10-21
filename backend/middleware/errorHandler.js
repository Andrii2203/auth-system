const logger = require('../utils/logger');
const AppError = require('../utils/AppError');

const errorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || 'Internal Server Error';
    err.errorCode = err.errorCode || 'INTERNAL_ERROR';

  if (err.statusCode === 500) {
        logger.error('Application error', {
            message: err.message,
            statusCode: err.statusCode,
            errorCode: err.errorCode,
            stack: err.stack,
            path: req.path,
            method: req.method,
            ip: req.ip,
        });
  } else {
        logger.warn('Client error', {
            message: err.message,
            statusCode: err.statusCode,
            errorCode: err.errorCode,
            path: req.path,
        });
  }

    res.status(err.statusCode).json({
        error: err.message,
        statusCode: err.statusCode,
        errorCode: err.errorCode,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
};

module.exports = errorHandler;