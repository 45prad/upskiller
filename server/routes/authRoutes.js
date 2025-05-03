import express from 'express';
import { register, login, getMe } from '../controllers/authController.js';
import { protect, authorize } from '../middleware/auth.js';
import { createUserWithRole } from '../controllers/authController.js';

const router = express.Router();

// router.post('/register', register);
// router.post('/create-user', createUserWithRole);
router.post('/login', login);
router.get('/me', protect, getMe);

router.use(protect);
router.use(authorize('admin'));
router.post('/register', register);


export default router;