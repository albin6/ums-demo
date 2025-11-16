import { Router } from 'express';
import { UserController } from '../controllers/user/UserController';
import { authenticate } from '../middleware/auth/auth';

const router = Router();
const userController = new UserController();

router.post('/signup', (req, res) => userController.signup(req, res));
router.post('/login', (req, res) => userController.login(req, res));
router.get('/profile', authenticate, (req, res) => userController.getProfile(req, res));
router.put('/profile', authenticate, (req, res) => userController.updateProfile(req, res));

export { router as userRoutes };