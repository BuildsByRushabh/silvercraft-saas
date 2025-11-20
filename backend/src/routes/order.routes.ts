import { Router } from 'express';
import { optionalAuth } from '../middleware/auth';
// Controllers to be implemented
// import * as orderController from '../controllers/order.controller';

const router = Router({ mergeParams: true });

// TODO: Implement order routes
// router.get('/', authenticateJWT, orderController.getOrders);
// router.post('/', optionalAuth, orderController.createOrder); // Public for leads
// router.get('/:orderId', authenticateJWT, orderController.getOrder);
// router.patch('/:orderId', authenticateJWT, requireRole('admin', 'staff'), orderController.updateOrder);

export default router;
