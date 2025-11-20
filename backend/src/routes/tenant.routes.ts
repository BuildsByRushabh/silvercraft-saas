import { Router } from 'express';
import { authenticateJWT, requireRole } from '../middleware/auth';
import { extractTenantContext, checkTenantAccess } from '../middleware/tenant';
import * as tenantController from '../controllers/tenant.controller';
import catalogueRoutes from './catalogue.routes';
import orderRoutes from './order.routes';
import aiRoutes from './ai.routes';

const router = Router();

// Public tenant creation (or super-admin only in production)
router.post('/', tenantController.createTenant);

// Tenant-specific routes (require authentication and tenant access)
router.use('/:tenantId', extractTenantContext);
router.get('/:tenantId', authenticateJWT, checkTenantAccess, tenantController.getTenant);
router.patch(
    '/:tenantId',
    authenticateJWT,
    checkTenantAccess,
    requireRole('admin'),
    tenantController.updateTenant
);

// Nested routes for tenant resources
router.use('/:tenantId/catalogue', authenticateJWT, checkTenantAccess, catalogueRoutes);
router.use('/:tenantId/orders', checkTenantAccess, orderRoutes); // Optional auth for public leads
router.use('/:tenantId/ai', authenticateJWT, checkTenantAccess, aiRoutes);

export default router;
