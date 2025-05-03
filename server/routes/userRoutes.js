import express from 'express';
import { 
  getAllUsers, 
  getUserById, 
  updateUser, 
  deleteUser,
  assignTokens,
  getPurchasedChallenges,
  getUsersCount
} from '../controllers/userController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/purchased-challenges', getPurchasedChallenges);

// Admin only routes
router.use(authorize('admin'));
router.get('/getUsersCount', getUsersCount)
router.route('/').get(getAllUsers);
router.route('/:id')
  .get(getUserById)
  .put(updateUser)
  .delete(deleteUser);
router.post('/:id/assign-tokens', assignTokens);


export default router;