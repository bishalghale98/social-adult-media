import rateLimit from 'express-rate-limit';

export const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: { error: 'Too many requests, please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
});

export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: { error: 'Too many auth attempts, please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
});

export const friendRequestLimiter = rateLimit({
    windowMs: 24 * 60 * 60 * 1000, // 24 hours
    max: 20,
    message: { error: 'Friend request limit reached for today.' },
    standardHeaders: true,
    legacyHeaders: false,
});

export const messageLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 30,
    message: { error: 'Message rate limit reached. Slow down.' },
    standardHeaders: true,
    legacyHeaders: false,
});
