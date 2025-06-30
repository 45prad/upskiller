import express from 'express';
import { 
  createChallenge, 
  getAllChallenges, 
  getChallengeDetails,
  updateChallenge, 
  deleteChallenge,
  purchaseChallenge,
  getChallengesByCategory,
  getChallengesCount,
} from '../controllers/challengeController.js';

import {getUserPurchasedChallenges} from '../controllers/userController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/getChallengesCount',getChallengesCount)
router.get('/', getAllChallenges);
router.get('/:id/details', getChallengeDetails);
router.get('/category/:categoryId', getChallengesByCategory);

// Protected routes
router.use(protect);
// router.get('/:id/content', getChallengeContent);
router.post('/:id/purchase', purchaseChallenge);


// Admin only routes
router.use(authorize('admin'));
router.post('/', createChallenge);
router.put('/:id', updateChallenge);
router.delete('/:id', deleteChallenge);



router.use(protect);
router.use(authorize('admin'));
router.get('/users/:userId/purchased-challenges',getUserPurchasedChallenges);


export default router;