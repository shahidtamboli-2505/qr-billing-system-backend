import express from 'express';
import { getOrders, createOrder, getOrderById, updateOrderStatus, deleteOrder } from '../controllers/orderController.js';

const router = express.Router();

router.route('/').get(getOrders).post(createOrder);
router.route('/:id').get(getOrderById).delete(deleteOrder);
router.route('/:id/status').patch(updateOrderStatus);

export default router;