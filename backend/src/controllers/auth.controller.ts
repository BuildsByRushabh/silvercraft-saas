import { Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../config/database';
import { hashPassword, comparePassword } from '../utils/hash';
import { generateToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { AppError } from '../middleware/errorHandler';
import logger from '../utils/logger';

// Validation schemas
const registerSchema = z.object({
    tenantId: z.string().uuid(),
    email: z.string().email(),
    password: z.string().min(8),
    name: z.string().min(1),
    role: z.enum(['admin', 'staff', 'customer']).default('staff'),
});

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
    tenantId: z.string().uuid(),
});

const refreshSchema = z.object({
    refreshToken: z.string(),
});

export const register = async (req: Request, res: Response) => {
    try {
        const validated = registerSchema.parse(req.body);

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: {
                tenantId_email: {
                    tenantId: validated.tenantId,
                    email: validated.email,
                },
            },
        });

        if (existingUser) {
            throw new AppError(400, 'User already exists with this email');
        }

        // Verify tenant exists
        const tenant = await prisma.tenant.findUnique({
            where: { id: validated.tenantId },
        });

        if (!tenant || !tenant.isActive) {
            throw new AppError(404, 'Tenant not found or inactive');
        }

        // Hash password
        const hashedPassword = await hashPassword(validated.password);

        // Create user
        const user = await prisma.user.create({
            data: {
                tenantId: validated.tenantId,
                email: validated.email,
                name: validated.name,
                hashedPassword,
                role: validated.role,
            },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                tenantId: true,
                createdAt: true,
            },
        });

        // Generate tokens
        const tokenPayload = {
            sub: user.id,
            tenantId: user.tenantId,
            email: user.email,
            role: user.role,
        };

        const token = generateToken(tokenPayload);
        const refreshToken = generateRefreshToken(tokenPayload);

        logger.info('User registered successfully', {
            userId: user.id,
            tenantId: user.tenantId,
            email: user.email,
        });

        res.status(201).json({
            user,
            token,
            refreshToken,
            expiresIn: 3600, // 1 hour in seconds
        });
    } catch (error) {
        if (error instanceof z.ZodError || error instanceof AppError) {
            throw error;
        }
        logger.error('Registration error', { error });
        throw new AppError(500, 'Registration failed');
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const validated = loginSchema.parse(req.body);

        // Find user
        const user = await prisma.user.findUnique({
            where: {
                tenantId_email: {
                    tenantId: validated.tenantId,
                    email: validated.email,
                },
            },
        });

        if (!user || !user.isActive) {
            throw new AppError(401, 'Invalid credentials');
        }

        // Verify password
        const isPasswordValid = await comparePassword(validated.password, user.hashedPassword);

        if (!isPasswordValid) {
            throw new AppError(401, 'Invalid credentials');
        }

        // Update last login
        await prisma.user.update({
            where: { id: user.id },
            data: { lastLogin: new Date() },
        });

        // Generate tokens
        const tokenPayload = {
            sub: user.id,
            tenantId: user.tenantId,
            email: user.email,
            role: user.role,
        };

        const token = generateToken(tokenPayload);
        const refreshToken = generateRefreshToken(tokenPayload);

        logger.info('User logged in successfully', {
            userId: user.id,
            tenantId: user.tenantId,
            email: user.email,
        });

        res.json({
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                tenantId: user.tenantId,
            },
            token,
            refreshToken,
            expiresIn: 3600,
        });
    } catch (error) {
        if (error instanceof z.ZodError || error instanceof AppError) {
            throw error;
        }
        logger.error('Login error', { error });
        throw new AppError(500, 'Login failed');
    }
};

export const refreshToken = async (req: Request, res: Response) => {
    try {
        const validated = refreshSchema.parse(req.body);

        // Verify refresh token
        const payload = verifyRefreshToken(validated.refreshToken);

        // Generate new access token
        const token = generateToken(payload);

        res.json({
            token,
            expiresIn: 3600,
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            throw error;
        }
        logger.error('Token refresh error', { error });
        throw new AppError(401, 'Invalid or expired refresh token');
    }
};
