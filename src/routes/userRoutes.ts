import express from 'express';
import {
  registerUserHandler,
  authUserHandler,
  getUserProfileHandler,
  updateUserProfileHandler,
  addFavoriteHandler,
  removeFavoriteHandler,
  recommendPropertyHandler,
  getRecommendationsHandler
} from '../controllers/user.controller';
import { protect } from '../middlewares/auth';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Users route works!' });
});

router.post('/register', registerUserHandler);
router.post('/login', authUserHandler);

router.route('/profile')
  .get(protect, getUserProfileHandler)
  .put(protect, updateUserProfileHandler);

router.route('/favorites/:propertyId')
  .post(protect, addFavoriteHandler)
  .delete(protect, removeFavoriteHandler);

router.post('/recommend', protect, recommendPropertyHandler);
router.get('/recommendations', protect, getRecommendationsHandler);

router.get('/test', (req, res) => {
  res.json({ message: "User routes are working!" });
});

export default router;