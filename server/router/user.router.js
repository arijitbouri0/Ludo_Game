import express from 'express';
import { getMyProfile, login, logout, register } from '../controller/user.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.post('/register',register);
router.post('/login',login);

router.use(authenticate);
router.get("/me",getMyProfile)
router.post("/logout",logout)

export default router;
