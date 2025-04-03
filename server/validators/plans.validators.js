import { body, param } from "express-validator";

export const validateParamId = [
    param("id").notEmpty().withMessage("ID is required").isUUID(4).withMessage("Invalid ID"),
];

export const validateCreatePlan = [
    body("name").notEmpty().withMessage("Name is required").isString().withMessage("Name must be a string"),
    body("description").notEmpty().withMessage("Description is required").isString().withMessage("Description must be a string"),
    body("months").notEmpty().withMessage("Months is required").isInt().withMessage("Months must be an integer"),
    body("price").notEmpty().withMessage("Price is required").isFloat().withMessage("Price must be a float"),
    body("offer_price").notEmpty().withMessage("Offer price is required").isFloat().withMessage("Offer price must be a float"),
    body("points").notEmpty().withMessage("Points is required").isArray().withMessage("Points must be an array"),
    body("points.*").notEmpty().withMessage("Points must be an array of strings"),
];

export const validateUpdatePlan = [
    ...validateParamId,
    ...validateCreatePlan,
];

