import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import config from './config/env';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { apiLimiter } from './middleware/rateLimiter';
import logger from './utils/logger';

// Import routes (to be created)
import authRoutes from './routes/auth.routes';
import tenantRoutes from './routes/tenant.routes';

const app = express();

// Security middleware
app.use(helmet());
app.use(
    cors({
        origin: config.cors.allowedOrigins,
        credentials: true,
    })
);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
    logger.info(`${req.method} ${req.path}`, {
        ip: req.ip,
        userAgent: req.get('user-agent'),
    });
    next();
});

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/tenants', apiLimiter, tenantRoutes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
