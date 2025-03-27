import express from 'express';
import { 
  login, 
  logout, 
  purchases, 
  signUp,

  } from '../controllers/user.controller.js';
import userMiddleware from '../middlewares/user.mid.js';



const router = express.Router();

router.post('/signUp', signUp)
router.post('/login', login);
router.get('/logout', logout);
router.get('/purchases', userMiddleware, purchases)


export default router;

