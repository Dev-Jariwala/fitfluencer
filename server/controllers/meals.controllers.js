import * as mealsRepository from "../repositories/meals.repositories.js";
import { deleteObject, generateSignedUrl, getObject, uploadObject } from "../services/storage/index.js";
import { handleError } from "../utils/error.js";
import { query } from "../utils/query.js";

const STORAGE_BUCKET = process.env.MINIO_BUCKET_NAME;

export const createMeal = async (req, res) => {
    try {
        const userId = req.user.id;
        const { name, description, quantity, unit, calories, protein, carbs, fat } = req.body;
        const meal = await mealsRepository.createMeal({ name, description, quantity, unit, calories, protein, carbs, fat, createdBy: userId });
        if (!meal) return res.status(400).json({ success: false, message: 'Failed to create meal', data: null });
        const file = req.file;
        if (file) {
            const fileData = file.buffer;
            const fileName = file.originalname;
            const mimeType = file.mimetype;
            const key = `fitfluencer/meals/${meal.id}_${fileName}`;
            await uploadObject(STORAGE_BUCKET, key, fileData, mimeType);
            await query('UPDATE meals SET attachment_path = $1 WHERE id = $2', [key, meal.id]);
            meal.attachment_path = key;
        }

        res.status(201).json({ success: true, message: 'Meal created successfully', data: meal });
    } catch (error) {
        handleError('createMeal', res, error);
    }
};

export const getMeals = async (req, res) => {
    try {
        const meals = await mealsRepository.getMeals();
        const mealsWithAttachment = await Promise.all(meals.map(async (meal) => {
            if (meal.attachment_path) {
                console.log(meal.attachment_path);
                console.log(STORAGE_BUCKET);
                const attachment = await generateSignedUrl(STORAGE_BUCKET, meal.attachment_path, 60 * 60 * 24 * 7);
                console.log(attachment);
                meal.attachment = attachment;
            }
            return meal;
        }));
        res.status(200).json({ success: true, message: 'Meals fetched successfully', data: mealsWithAttachment });
    } catch (error) {
        handleError('getMeals', res, error);
    }
};

export const getMealById = async (req, res) => {
    try {
        const { id } = req.params;
        const meal = await mealsRepository.getMealById(id);
        res.status(200).json({ success: true, message: 'Meal fetched successfully', data: meal });
    } catch (error) {
        handleError('getMealById', res, error);
    }
};

export const updateMeal = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const { name, description, quantity, unit, calories, protein, carbs, fat, isActive } = req.body;
        const meal = await mealsRepository.updateMeal(id, { name, description, quantity, unit, calories, protein, carbs, fat, isActive, updatedBy: userId });
        if (!meal) return res.status(400).json({ success: false, message: 'Failed to update meal', data: null });
        const file = req.file;
        if (file) {
            if (meal.attachment_path) {
                await deleteObject(STORAGE_BUCKET, meal.attachment_path);
            }
            const fileData = file.buffer;
            const fileName = file.originalname;
            const mimeType = file.mimetype;
            const key = `fitfluencer/meals/${meal.id}_${fileName}`;
            await uploadObject(STORAGE_BUCKET, key, fileData, mimeType);
            await query('UPDATE meals SET attachment_path = $1 WHERE id = $2', [key, meal.id]);
            meal.attachment_path = key;
        }
        res.status(200).json({ success: true, message: 'Meal updated successfully', data: meal });
    } catch (error) {
        handleError('updateMeal', res, error);
    }
};

export const deleteMeal = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Get the meal first to check if it has an attachment
        const existingMeal = await mealsRepository.getMealById(id);
        if (!existingMeal) {
            return res.status(404).json({ 
                success: false, 
                message: 'Meal not found', 
                data: null 
            });
        }
        
        // Delete attachment if it exists
        if (existingMeal.attachment_path) {
            await deleteObject(STORAGE_BUCKET, existingMeal.attachment_path);
        }
        
        // Delete the meal from database
        const meal = await mealsRepository.deleteMeal(id);
        if (!meal) {
            return res.status(400).json({ 
                success: false, 
                message: 'Failed to delete meal', 
                data: null 
            });
        }
        
        res.status(200).json({ 
            success: true, 
            message: 'Meal deleted successfully', 
            data: meal 
        });
    } catch (error) {
        handleError('deleteMeal', res, error);
    }
};






