import { Router } from 'express';
import OrderController from '../controllers/order.controller';
import { isAuthenticated } from '../middlewares/auth.middleware';

const router: Router = Router();
const orderController: OrderController = new OrderController();

router.post('/createOrder', isAuthenticated, orderController.createOrder);

export default router;
