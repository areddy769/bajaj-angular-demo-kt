import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { authorizeRoles } from '../middleware/role.middleware';
import * as customerController from '../controllers/customer.controller';

const router = Router();

// All customer APIs require authentication.
router.use(authenticate);

router.get('/', customerController.list);
router.get('/:id', customerController.getById);
// USER and ADMIN can create / update…
router.post('/', authorizeRoles('ADMIN', 'USER'), customerController.create);
router.put('/:id', authorizeRoles('ADMIN', 'USER'), customerController.update);
// …but ONLY ADMIN can delete.
router.delete('/:id', authorizeRoles('ADMIN'), customerController.remove);

export default router;
