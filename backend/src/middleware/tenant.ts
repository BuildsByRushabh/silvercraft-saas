import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';
import logger from '../utils/logger';

/**
 * CRITICAL SECURITY MIDDLEWARE
 * Extracts and validates tenant context from request
 * Ensures users can only access data from their own tenant
 */
export const extractTenantContext = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { tenantId } = req.params;

    if (!tenantId) {
        return res.status(400).json({ error: 'Tenant ID required' });
    }

    // Verify tenant exists and is active
    try {
        const tenant = await prisma.tenant.findUnique({
            where: { id: tenantId },
            select: {
                id: true,
                name: true,
                subdomain: true,
                isActive: true,
            },
        });

        if (!tenant) {
            return res.status(404).json({ error: 'Tenant not found' });
        }

        if (!tenant.isActive) {
            return res.status(403).json({ error: 'Tenant account is inactive' });
        }

        // Attach tenant to request
        req.tenant = tenant;

        next();
    } catch (error) {
        logger.error('Error fetching tenant', { tenantId, error });
        return res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * CRITICAL SECURITY MIDDLEWARE
 * Verifies that the authenticated user belongs to the requested tenant
 * Prevents cross-tenant data access
 */
export const checkTenantAccess = (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Authentication required' });
    }

    if (!req.tenant) {
        return res.status(400).json({ error: 'Tenant context not set' });
    }

    // CRITICAL: Verify user's tenant matches requested tenant
    if (req.user.tenantId !== req.tenant.id) {
        logger.warn('Cross-tenant access attempt blocked', {
            userId: req.user.sub,
            userTenantId: req.user.tenantId,
            requestedTenantId: req.tenant.id,
            ip: req.ip,
        });

        return res.status(403).json({ error: 'Access denied to this tenant' });
    }

    next();
};

/**
 * Extracts tenant from subdomain (for public routes)
 */
export const extractTenantFromSubdomain = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const host = req.get('host');

    if (!host) {
        return next();
    }

    // Extract subdomain (e.g., "silverartisan" from "silverartisan.silvercraftsaas.com")
    const subdomain = host.split('.')[0];

    if (subdomain && subdomain !== 'www' && subdomain !== 'api') {
        try {
            const tenant = await prisma.tenant.findUnique({
                where: { subdomain },
                select: {
                    id: true,
                    name: true,
                    subdomain: true,
                    isActive: true,
                },
            });

            if (tenant && tenant.isActive) {
                req.tenant = tenant;
            }
        } catch (error) {
            logger.error('Error fetching tenant by subdomain', { subdomain, error });
        }
    }

    next();
};
