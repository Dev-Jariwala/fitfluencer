import { body, param } from "express-validator";
/* -- Config table
CREATE TABLE config (
    sr_no SERIAL PRIMARY KEY,
    id UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
    key VARCHAR(50) NOT NULL UNIQUE, -- MAX_CHAIN_DIETITIAN (max number of dietitian admin can have in his single line)
    type VARCHAR(50) NOT NULL CHECK (type IN ('string', 'number', 'boolean', 'json')), -- number
    name VARCHAR(50) NOT NULL, -- Max Downline Dietitian
    value INT NOT NULL -- 2
); */

export const validateParamId = [
    param("id").notEmpty().withMessage("ID is required").isUUID(4).withMessage("Invalid ID"),
];

export const validateParamKey = [
    param("key").notEmpty().withMessage("Key is required").isString().withMessage("Key must be a string"),
];

export const validateCreateConfig = [
    body("key").notEmpty().withMessage("Key is required").isString().withMessage("Key must be a string"),
    body("type").notEmpty().withMessage("Type is required").isIn(['string', 'number', 'boolean', 'json']).withMessage("Invalid type"),
    body("name").notEmpty().withMessage("Name is required").isString().withMessage("Name must be a string"),
    body("value").notEmpty().withMessage("Value is required"),
];

export const validateUpdateConfig = [
    ...validateParamId,
    ...validateCreateConfig,
];


