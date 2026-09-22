import { Router } from 'express';
import {
  getNotifications,
  getUnreadCount,
  readAllNotifications,
  readNotification,
} from '../controllers/notification.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(requireAuth);
router.get('/', getNotifications);
router.get('/unread-count', getUnreadCount);
router.patch('/read-all', readAllNotifications);
router.patch('/:id/read', readNotification);

export default router;
