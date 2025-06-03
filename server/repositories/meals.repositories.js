/* 
-- Meals table
CREATE TABLE meals (
    sr_no SERIAL PRIMARY KEY,
    id UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    quantity DECIMAL(6,2) NOT NULL, -- e.g., 100.00
    unit VARCHAR(20) NOT NULL CHECK (unit IN ('g', 'ml', 'cup', 'piece', 'serving')),
    calories INT,
    protein DECIMAL(5,2),
    carbs DECIMAL(5,2),
    fat DECIMAL(5,2),
    attachment_path VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by UUID REFERENCES users(id)
); */

import { query } from "../utils/query.js";

export const createMeal = async ({ name, description, quantity, unit, calories, protein, carbs, fat, createdBy }) => {
    const sql = `
        INSERT INTO meals (name, description, quantity, unit, calories, protein, carbs, fat, created_by)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *
    `;
    const values = [name, description, quantity, unit, calories, protein, carbs, fat, createdBy];
    const [result] = await query(sql, values);
    return result;
};

export const getMeals = async () => {
    const sql = `
        SELECT * FROM meals
    `;
    const result = await query(sql);
    return result;
};

export const getMealById = async (id) => {
    const sql = `
        SELECT * FROM meals WHERE id = $1
    `;
    const values = [id];
    const [result] = await query(sql, values);
    return result;
};

export const updateMeal = async (id, { name, description, quantity, unit, calories, protein, carbs, fat, isActive, updatedBy }) => {
    const sql = `
        UPDATE meals SET name = $1, description = $2, quantity = $3, unit = $4, calories = $5, protein = $6, carbs = $7, fat = $8, is_active = $9, updated_by = $10 WHERE id = $11 RETURNING *
    `;
    const values = [name, description, quantity, unit, calories, protein, carbs, fat, isActive, updatedBy, id];
    const [result] = await query(sql, values);
    return result;
};

export const deleteMeal = async (id) => {
    const sql = `
        DELETE FROM meals WHERE id = $1 RETURNING *
    `;
    const values = [id];
    const [result] = await query(sql, values);
    return result;
};