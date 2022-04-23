import { Router } from "express";
import * as UserController from '../controllers/UserController';
import { Auth } from "../middlewares/auth";

const router = Router();

router.post('/register', UserController.create);
router.post('/login', UserController.login);
router.post('/validateToken', UserController.validateToken)
router.get('/users', Auth.private, UserController.getUsers);
router.get('/userId/:id', Auth.private, UserController.getUserById);
router.put('/updateUser/:id', Auth.private, UserController.updateUser);
router.delete('/deleteUser/:id', Auth.private, UserController.deleteUser);


export default router;