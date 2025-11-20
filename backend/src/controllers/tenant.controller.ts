import { Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../config/database';
import { hashPassword } from '../utils/hash';
import { generateToken, generateRefreshToken } from '../utils/jwt';
import { AppError } from '../middleware/errorHandler';
import logger from '../utils/logger';

const createTenantSchema = z.object({
    name: z.string().min(1).max(255),
    subdomain: z.string().min(3).max(100).regex(/^[a-z0-9-]+$/),
    accentColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
    adminEmail: z.string().email(),
    adminPassword: z.string().min(8),
    adminName: z.string().min(1),
});

const updateTenantSchema = z.object({
    name: z.string().min(1).max(255).optional(),
    logoUrl: z.string().url().optional(),
    accentColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
    theme: z.enum(['light', 'dark', 'auto']).optional(),
    customDomain: z.string().optional(),
});

export const createTenant = async (req: Request, res: Response) => {
    try {
        const validated = createTenantSchema.parse(req.body);

        // Check if subdomain is already taken
        const existingTenant = await prisma.tenant.findUnique({
            where: { subdomain: validated.subdomain },
        });

        if (existingTenant) {
            throw new AppError(400, 'Subdomain already taken');
        }

        // Hash admin password
        const hashedPassword = await hashPassword(validated.adminPassword);

        // Create tenant and admin user in a transaction
        const result = await prisma.$transaction(async (tx) => {
            // Create tenant
            const tenant = await tx.tenant.create({
                data: {
                    name: validated.name,
                    subdomain: validated.subdomain,
                    accentColor: validated.accentColor || '#C0B8A7',
                },
            });

            // Create admin user
            const admin = await tx.user.create({
                data: {
                    tenantId: tenant.id,
                    email: validated.adminEmail,
                    name: validated.adminName,
                    hashedPassword,
                    role: 'admin',
                },
            });

            return { tenant, admin };
        });

        // Generate tokens for admin
        const tokenPayload = {
            sub: result.admin.id,
            tenantId: result.tenant.id,
            email: result.admin.email,
            role: result.admin.role,
        };

        const token = generateToken(tokenPayload);
        const refreshToken = generateRefreshToken(tokenPayload);

        logger.info('Tenant created successfully', {
            tenantId: result.tenant.id,
            subdomain: result.tenant.subdomain,
            adminEmail: result.admin.email,
        });

        res.status(201).json({
            tenant: {
                id: result.tenant.id,
                name: result.tenant.name,
                subdomain: result.tenant.subdomain,
                accentColor: result.tenant.accentColor,
                plan: result.tenant.plan,
                createdAt: result.tenant.createdAt,
            },
            admin: {
                id: result.admin.id,
                email: result.admin.email,
                name: result.admin.name,
                role: result.admin.role,
            },
            token,
            refreshToken,
        });
    } catch (error) {
        if (error instanceof z.ZodError || error instanceof AppError) {
            throw error;
        }
        logger.error('Tenant creation error', { error });
        throw new AppError(500, 'Failed to create tenant');
    }
};

export const getTenant = async (req: Request, res: Response) => {
    try {
        const { tenantId } = req.params;

        const tenant = await prisma.tenant.findUnique({
            where: { id: tenantId },
            select: {
                id: true,
                name: true,
                subdomain: true,
                logoUrl: true,
                accentColor: true,
                theme: true,
                plan: true,
                customDomain: true,
                isActive: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        if (!tenant) {
            throw new AppError(404, 'Tenant not found');
        }

        res.json(tenant);
    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        }
        logger.error('Get tenant error', { error });
        throw new AppError(500, 'Failed to fetch tenant');
    }
};

export const updateTenant = async (req: Request, res: Response) => {
    try {
        const { tenantId } = req.params;
        const validated = updateTenantSchema.parse(req.body);

        const tenant = await prisma.tenant.update({
            where: { id: tenantId },
            data: validated,
            select: {
                id: true,
                name: true,
                subdomain: true,
                logoUrl: true,
                accentColor: true,
                theme: true,
                plan: true,
                customDomain: true,
                updatedAt: true,
            },
        });

        logger.info('Tenant updated', {
            tenantId,
            changes: validated,
        });

        res.json(tenant);
    } catch (error) {
        if (error instanceof z.ZodError || error instanceof AppError) {
            throw error;
        }
        logger.error('Update tenant error', { error });
        throw new AppError(500, 'Failed to update tenant');
    }
};
