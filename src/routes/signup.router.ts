import express from "express";
import SignupController from '../controllers/signup.controller';
const router = express.Router();
const signupController = new SignupController();

router.post( "/signup", signupController.signup );

export default router;