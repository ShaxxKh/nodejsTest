import express from "express";
import SigninController from '../controllers/signin.controller';
const router = express.Router();
const signupController = new SigninController();

router.post( "/signin", signupController.signin );

export default router;