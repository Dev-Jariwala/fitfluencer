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

export default router;
