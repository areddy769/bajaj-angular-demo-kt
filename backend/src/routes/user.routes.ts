import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { authorizeRoles } from '../middleware/role.middleware';
import * as userController from '../controllers/user.controller';

const router = Router();

// Entire user-management area is ADMIN-only.
router.use(authenticate, authorizeRoles('ADMIN'));

router.get('/', userController.list);
router.get('/:id', userController.getById);
router.post('/', userController.create);
router.put('/:id', userController.update);
router.patch('/:id/status', userController.updateStatus);

export default router;
