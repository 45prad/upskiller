import express from 'express';
import { 
  createCategory, 
  getAllCategories, 
  getCategoryById, 
  updateCategory, 
  deleteCategory,
  getCategoriesCount
} from '../controllers/categoryController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/getCategoriesCount',getCategoriesCount);
router.get('/', getAllCategories);

router.get('/:id', getCategoryById);


// Admin only routes
router.use(protect, authorize('admin'));
router.post('/', createCategory);
router.put('/:id', updateCategory);
router.delete('/:id', deleteCategory);

export default router;