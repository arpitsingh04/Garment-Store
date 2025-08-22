import express from 'express';
import {
  getContacts,
  getContact,
  createContact,
  updateContactStatus,
  deleteContact
} from '../controllers/contactController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router
  .route('/')
  .get(protect, authorize('admin'), getContacts)
  .post(createContact);

router
  .route('/:id')
  .get(protect, authorize('admin'), getContact)
  .put(protect, authorize('admin'), updateContactStatus)
  .delete(protect, authorize('admin'), deleteContact);

export default router;
