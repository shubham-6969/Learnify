import express from 'express';
import { login, logout, signUp } from '../controllers/admin.controller.js';


const router = express.Router();

router.post('/signUp', signUp);
router.post('/login', login);
router.get('/logout', logout);


export default router;