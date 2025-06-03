import express from "express";
import * as mealsController from "../controllers/meals.controllers.js";
import { authUser } from "../middlewares/auth.middleware.js";
import multer from "multer";
const upload = multer();

const router = express.Router();

router.post("/", authUser, upload.single("attachment"), mealsController.createMeal);
router.get("/", authUser, mealsController.getMeals);
router.get("/:id", authUser, mealsController.getMealById);
router.put("/:id", authUser, upload.single("attachment"), mealsController.updateMeal);
router.delete("/:id", authUser, mealsController.deleteMeal);

export default router;
