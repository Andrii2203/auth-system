const fs = require('fs');
const path = require('path');
const config = require('../config/config');

const logsDir = path.join(__dirname, '../logs');

if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir);
}

const logLevels = {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3,
};

const logger = {
    formatMessage: (level, message, data = {}) => {
        const timestamp = new Date().toISOString();
            return JSON.stringify({
                timestamp,
                level,
                message,
                ...data,
        });
  },

    error: (message, data) => {
        const formatted = logger.formatMessage('ERROR', message, data);
        console.error(`[ERROR] ${message}`, data);
        fs.appendFileSync(
            path.join(logsDir, 'error.log'),
            formatted + '\n'
        );
    },

    warn: (message, data) => {
        const formatted = logger.formatMessage('WARN', message, data);
        if (config.LOG_LEVEL !== 'error') {
            console.warn(`[WARN] ${message}`, data);
        }
        fs.appendFileSync(
            path.join(logsDir, 'app.log'),
            formatted + '\n'
        );
    },

    info: (message, data) => {
        const formatted = logger.formatMessage('INFO', message, data);
            if (logLevels[config.LOG_LEVEL] >= logLevels.info) {
            console.log(`[INFO] ${message}`, data);
        }
        fs.appendFileSync(
            path.join(logsDir, 'app.log'),
            formatted + '\n'
        );
    },

    debug: (message, data) => {
        const formatted = logger.formatMessage('DEBUG', message, data);
        if (logLevels[config.LOG_LEVEL] >= logLevels.debug) {
            console.log(`[DEBUG] ${message}`, data);
        }
    },
};

module.exports = logger;