/* const winston = require('winston');

const { combine, timestamp, json, align, printf } = winston.format;
const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'debug',
    format: combine(
        timestamp({
            format: 'YYYY-MM-DD HH:mm:ss.SSS A'
        }),
        align(),
        printf(info => `[${info.timestamp} ${info.level}: ${info.message} ${JSON.stringify(info)}]`)
    ),
    defaultMeta: { service: 'user-service' },
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ dirname: 'logs', filename: 'error.log', level: 'error' }),
        new winston.transports.File({ dirname: 'logs', filename: 'combined.log' })
    ]
});

module.exports = logger; */