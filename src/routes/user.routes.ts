import { Router } from 'express';
import UserController from '../controllers/user.controller';
import { isAuthenticated } from '../middlewares/auth.middleware';

const router: Router = Router();
const userController: UserController = new UserController();

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/me', isAuthenticated, userController.getUserDetails);
router.get('/logout', userController.logout);
router.get('/getAllUsers', userController.getAllUsers);
router.get(
  '/updateToAdminRoleById/:id',
  isAuthenticated,
  userController.updateToAdminRoleById
); //? temprary route to make admin

export default router;
