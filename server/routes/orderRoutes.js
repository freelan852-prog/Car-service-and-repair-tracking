/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Router } from 'express';
import {
  createOrder,
  getOrders,
  getOrderById,
  handleExtraDecision,
} from '../controllers/orderController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.use(authMiddleware);

router.post('/', createOrder);
router.get('/', getOrders);
router.get('/:id', getOrderById);
router.patch('/:id/extras/:extraId', handleExtraDecision);

export default router;
