const { body, validationResult } = require('express-validator');
const config = require('../config/config');

const validateAuthInput = [
    body('email')
        .trim()
        .isEmail()
        .withMessage('Invalid email address')
        .isLength({ max: config.SECURITY.EMAIL_MAX_LENGTH })
        .withMessage(`Email must not exceed ${config.SECURITY.EMAIL_MAX_LENGTH} characters`),

    body('password')
        .isLength({ 
            min: config.SECURITY.PASSWORD_MIN_LENGTH,
            max: config.SECURITY.PASSWORD_MAX_LENGTH 
        })
        .withMessage(
            `Password must be between ${config.SECURITY.PASSWORD_MIN_LENGTH} and ${config.SECURITY.PASSWORD_MAX_LENGTH} characters`
        ),
];

const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(err => ({
            field: err.param,
            message: err.msg,
    }));

    return res.status(400).json({
        error: 'Validation failed',
        details: errorMessages,
        });
    }

    next();
};

module.exports = {
    validateAuthInput,
    handleValidationErrors,
};