import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { authorizeRoles } from '../middleware/role.middleware';
import { summary } from '../controllers/dashboard.controller';

const router = Router();

router.get('/summary', authenticate, authorizeRoles('ADMIN', 'USER'), summary);

export default router;
