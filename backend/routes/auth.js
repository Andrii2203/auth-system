const express = require('express');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const { validateAuthInput, handleValidationErrors } = require('../middleware/validation');
const { loginLimiter, registerLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

router.post(
    '/register',
    registerLimiter,
    validateAuthInput,
    handleValidationErrors,
    authController.register
);

router.post(
    '/login',
    loginLimiter,
    validateAuthInput,
    handleValidationErrors,
    authController.login
);

router.post(
    '/logout',
    authMiddleware,
    authController.logout
);

router.get(
    '/me',
    authMiddleware,
    authController.getUser
);

module.exports = router;