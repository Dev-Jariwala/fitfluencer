import { body, param } from "express-validator";

export const validateParamId = [
    param("id").notEmpty().withMessage("ID is required").isUUID(4).withMessage("Invalid ID"),
];

export const validateCreateRole = [
    body("key").notEmpty().withMessage("Key is required"),
    body("name").notEmpty().withMessage("Name is required"),
];

export const validateUpdateRole = [
    ...validateParamId,
    body("key").notEmpty().withMessage("Key is required"),
    body("name").notEmpty().withMessage("Name is required"),
];
