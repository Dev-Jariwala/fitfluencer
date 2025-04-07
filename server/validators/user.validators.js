import { body, param } from "express-validator";

export const validateSignIn = [
    body("loginId").notEmpty().withMessage("Login ID is required"),
    body("password").notEmpty().withMessage("Password is required"),
];

export const validateGenerateInviteLink = [
    body("roleId").notEmpty().withMessage("Role ID is required").isUUID(4).withMessage("Invalid role ID"),
];

export const validateToken = [
    body("token").notEmpty().withMessage("Token is required"),
];

export const validateRegisterUser = [
    body("token").notEmpty().withMessage("Token is required"),
    body("email").notEmpty().withMessage("Email is required").isEmail().withMessage("Invalid email"),
    body("phone").notEmpty().withMessage("Phone is required").isMobilePhone().withMessage("Invalid phone number"),
    body("username").notEmpty().withMessage("Username is required"),
    body("firstName").notEmpty().withMessage("First name is required"),
    body("lastName").notEmpty().withMessage("Last name is required"),
    body("password").notEmpty().withMessage("Password is required").isLength({ min: 8 }).withMessage("Password must be at least 8 characters long"),
    body("confirmPassword").notEmpty().withMessage("Confirm password is required").isLength({ min: 8 }).withMessage("Confirm password must be at least 8 characters long").custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error("Passwords do not match");
        }
        return true;
    }),
    body("gender").notEmpty().withMessage("Gender is required"),
    body("dob").notEmpty().withMessage("Date of birth is required"),
    body("height").notEmpty().withMessage("Height is required"),
    body("weight").notEmpty().withMessage("Weight is required"),
    body("fitnessGoal").notEmpty().withMessage("Fitness goal is required"),
    body("address").notEmpty().withMessage("Address is required"),
    body("city").notEmpty().withMessage("City is required"),
    body("state").notEmpty().withMessage("State is required"),
];

