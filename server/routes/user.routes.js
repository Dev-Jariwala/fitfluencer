// routes/users.js
import express from "express";
import * as userControllers from '../controllers/user.controllers.js';
import * as userValidators from '../validators/user.validators.js';
import validate from "../middlewares/validate.middleware.js";
import { authUser } from "../middlewares/auth.middleware.js";
const router = express.Router();

// create user
router.post("/login", userValidators.validateSignIn, validate, userControllers.loginUser);
router.post("/logout", authUser, userControllers.logoutUser);
router.get("/authenticate", userControllers.authenticateUser);
router.post("/generate-invite-link", authUser, userValidators.validateGenerateInviteLink, validate, userControllers.generateInviteLink);
router.post("/verify-invite-link", userValidators.validateToken, validate, userControllers.verifyInviteLink);
router.post("/register", userValidators.validateRegisterUser, validate, userControllers.registerUser);
router.get("/can-invite-dietitian", authUser, userControllers.getCanInviteDietitian);
export default router;
