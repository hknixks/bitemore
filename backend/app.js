const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const router = require('./routers');
const { apiLimiter } = require('./middleware/rateLimiters');

const app = express();

// The API sits behind Render's proxy; this makes rate limiting see the real client address.
app.set('trust proxy', 1);

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));

// Which websites may call this API from a browser. Add more with CLIENT_ORIGINS (comma separated).
const defaultOrigins = [
    'https://bitemore-chi.vercel.app',
    'http://localhost:5173',
    'http://localhost:4173',
    'http://localhost:3000',
];
const allowedOrigins = (process.env.CLIENT_ORIGINS
    ? process.env.CLIENT_ORIGINS.split(',').map((origin) => origin.trim()).filter(Boolean)
    : defaultOrigins);

app.use(cors({
    origin(origin, callback) {
        // No Origin header means curl/server-to-server, not a browser page.
        if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
        return callback(null, false);
    },
}));

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Cheap endpoint for uptime pings (keeps a sleeping free-tier host warm).
app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));

app.use('/api/v1', apiLimiter, router);

// Last resort: never send stack traces to the browser.
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
    const status = err.status || (err.code === 'LIMIT_FILE_SIZE' ? 400 : 500);
    const message = err.code === 'LIMIT_FILE_SIZE'
        ? 'That image is too large (max 5 MB)'
        : status < 500 ? err.message : 'Internal server error';
    if (status >= 500) console.error('Unhandled error:', err.message);
    res.status(status).json({ message, status: false });
});

module.exports = app;
