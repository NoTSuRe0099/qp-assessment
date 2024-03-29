import { Router } from 'express';
import GroceryController from '../controllers/grocery.cotroller';
import { validateData } from '../ErrorHandlers';
import { GrocerySchema } from '../validations/grocery.validations';
import { isAdmin, isAuthenticated } from '../middlewares/auth.middleware';

const router: Router = Router();
const groceryController: GroceryController = new GroceryController();

router.post(
  '/createNewItem',
  isAuthenticated,
  isAdmin,
  validateData(GrocerySchema),
  groceryController.createItem
);
router.get('/getAllItems', isAuthenticated, groceryController.getAllItems);
router.put(
  '/updateItem/:id',
  isAuthenticated,
  isAdmin,
  groceryController.updateItem
);
router.delete(
  '/deleteItem/:id',
  isAuthenticated,
  isAdmin,
  groceryController.deleteItem
);
router.get('/getItem/:id', isAuthenticated, groceryController.getItem);

export default router;
