/* -- Daily Fitness Logs table
CREATE TABLE daily_fitness_logs (
    sr_no SERIAL PRIMARY KEY,
    id UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    entry_date DATE NOT NULL, -- e.g., '2025-04-13'
    height_cm DECIMAL(5,2),   -- Optional daily if you want to allow updated tracking
    weight_kg DECIMAL(5,2),
    calories_taken INT,
    protein_g DECIMAL(5,2),
    carbs_g DECIMAL(5,2),
    fat_g DECIMAL(5,2),
    water_liters DECIMAL(4,2),
    steps INT,
    sleep_hours DECIMAL(4,2),
    mood VARCHAR(50), -- optional like 'happy', 'tired'
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, entry_date) -- One entry per day per user
); */
import { query } from "../utils/query.js";

export const createDailyFitnessLog = async (dailyFitnessLog) => {
    const { user_id, entry_date, height_cm, weight_kg, calories_taken, protein_g, carbs_g, fat_g, water_liters, steps, sleep_hours, mood, notes } = dailyFitnessLog;
    const sql = `INSERT INTO daily_fitness_logs (user_id, entry_date, height_cm, weight_kg, calories_taken, protein_g, carbs_g, fat_g, water_liters, steps, sleep_hours, mood, notes) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`;
    const result = await query(sql, [user_id, entry_date, height_cm, weight_kg, calories_taken, protein_g, carbs_g, fat_g, water_liters, steps, sleep_hours, mood, notes]);
    return result;
};
