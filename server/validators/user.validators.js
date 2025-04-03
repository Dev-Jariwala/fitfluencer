import { body, param } from "express-validator";

export const validateSignIn = [
    body("loginId").notEmpty().withMessage("Login ID is required"),
    body("password").notEmpty().withMessage("Password is required"),
];
