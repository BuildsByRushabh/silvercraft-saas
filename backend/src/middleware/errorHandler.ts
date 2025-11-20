import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import logger from '../utils/logger';

export class AppError extends Error {
    constructor(
        public statusCode: number,
        public message: string,
        public isOperational = true
    ) {
        super(message);
        Object.setPrototypeOf(this, AppError.prototype);
    }
}

export const errorHandler = (
    err: Error | AppError | ZodError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // Zod validation errors
    if (err instanceof ZodError) {
        logger.warn('Validation error', { errors: err.errors, path: req.path });
        return res.status(400).json({
            error: 'Validation failed',
            details: err.errors.map((e) => ({
                path: e.path.join('.'),
                message: e.message,
            })),
        });
    }

    // Application errors
    if (err instanceof AppError) {
        logger.error('Application error', {
            statusCode: err.statusCode,
            message: err.message,
            path: req.path,
        });

        return res.status(err.statusCode).json({
            error: err.message,
        });
    }

    // Unknown errors
    logger.error('Unexpected error', {
        error: err.message,
        stack: err.stack,
        path: req.path,
    });

    return res.status(500).json({
        error: 'Internal server error',
    });
};

export const notFoundHandler = (req: Request, res: Response) => {
    res.status(404).json({
        error: 'Route not found',
        path: req.path,
    });
};
