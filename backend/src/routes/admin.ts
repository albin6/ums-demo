import { Router } from 'express';
import { AdminController } from '../controllers/admin/AdminController';
import { authenticate, authorizeAdmin } from '../middleware/auth/auth';

const router = Router();
const adminController = new AdminController();

router.post('/login', (req, res) => adminController.login(req, res));
router.get('/users', authenticate, authorizeAdmin, (req, res) => adminController.getUsers(req, res));
router.patch('/users/:id/block', authenticate, authorizeAdmin, (req, res) => adminController.blockUser(req, res));
router.patch('/users/:id/unblock', authenticate, authorizeAdmin, (req, res) => adminController.unblockUser(req, res));

export { router as adminRoutes };