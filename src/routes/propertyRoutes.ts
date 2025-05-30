import express from 'express';
import {
  createPropertyHandler,
  getPropertyHandler,
  updatePropertyHandler,
  deletePropertyHandler,
  searchPropertiesHandler
} from '../controllers/property.controller';
import { protect } from '../middlewares/auth';

const router = express.Router();

router.route('/')
  .post(protect, createPropertyHandler)
  .get(searchPropertiesHandler);

router.route('/:id')
  .get(getPropertyHandler)
  .put(protect, updatePropertyHandler)
  .delete(protect, deletePropertyHandler);

export default router;