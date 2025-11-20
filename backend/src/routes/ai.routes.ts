import { Router } from 'express';
import { aiLimiter } from '../middleware/rateLimiter';
// Controllers to be implemented
// import * as aiController from '../controllers/ai.controller';

const router = Router({ mergeParams: true });

// TODO: Implement AI routes
// router.post('/design-suggestion', aiLimiter, aiController.generateDesignSuggestion);

export default router;
