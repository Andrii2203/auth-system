const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');
const config = require('../config/config');
const AppError = require('../utils/AppError');
const logger = require('../utils/logger');

exports.register = async (req, res, next) => {
    let connection;
    try {
        const { email, password } = req.body;

        connection = await pool.getConnection();


        const [rows] = await connection.execute(
            'SELECT id FROM users WHERE email = ?',
            [email]
        );

        if (rows.length > 0) {
            logger.warn('Registration attempt with existing email', { email });
            throw new AppError('User with this email already exists', 409, 'USER_EXISTS');
        }

        const hashedPassword = await bcrypt.hash(
            password,
            config.SECURITY.BCRYPT_ROUNDS
        );


        const [result] = await connection.execute(
            'INSERT INTO users (email, password_hash) VALUES (?, ?)',
            [email, hashedPassword]
        );

        logger.info('User registered successfully', { 
            userId: result.insertId,
            email 
        });

        return res.status(201).json({
            message: 'User successfully registered',
            userId: result.insertId,
        });
    } catch (error) {
        if (error instanceof AppError) {
            return next(error);
        }

        logger.error('Registration error', {
            email: req.body?.email,
            error: error.message,
            stack: error.stack,
        });

        next(new AppError('Registration failed', 500));
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

exports.login = async (req, res, next) => {
    let connection;
    try {
        const { email, password } = req.body;

        connection = await pool.getConnection();

        const [rows] = await connection.execute(
            'SELECT id, email, password_hash FROM users WHERE email = ?',
            [email]
        );

        if (rows.length === 0) {
            logger.warn('Login attempt with non-existent email', { email });
            throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
        }

        const user = rows[0];

        const isPasswordValid = await bcrypt.compare(password, user.password_hash);

        if (!isPasswordValid) {
            logger.warn('Login attempt with wrong password', { 
                email,
                ip: req.ip 
            });
            throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
        }

        const token = jwt.sign(
            { id: user.id, email: user.email },
            config.JWT.SECRET,
            { expiresIn: '30m' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: config.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 30 * 60 * 1000,
        });

        logger.info('User logged in successfully', { 
            userId: user.id,
            email 
        });

        return res.status(200).json({
            message: 'Successfully logged in',
            token,
            user: {
                id: user.id,
                email: user.email,
            },
        });
    } catch (error) {
        if (error instanceof AppError) {
            return next(error);
        }

        logger.error('Login error', {
            email: req.body?.email,
            error: error.message,
            stack: error.stack,
        });

        next(new AppError('Login failed', 500));
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

exports.logout = (req, res, next) => {
    try {
        res.clearCookie('token');

        logger.info('User logged out', { 
            userId: req.user.id,
            email: req.user.email 
        });

        return res.status(200).json({
            message: 'Successfully logged out',
        });
    } catch (error) {
        logger.error('Logout error', {
            userId: req.user?.id,
            error: error.message,
        });

        next(new AppError('Logout failed', 500));
    }
};

exports.getUser = async (req, res, next) => {
    try {
        if (!req.user) {
            throw new AppError('Not authorized', 401, 'NOT_AUTHORIZED');
        }

        return res.status(200).json({
            user: {
                id: req.user.id,
                email: req.user.email,
            },
        });
    } catch (error) {
        if (error instanceof AppError) {
            return next(error);
        }

        logger.error('Get user error', {
            userId: req.user?.id,
            error: error.message,
        });

        next(new AppError('Failed to get user info', 500));
    }
};