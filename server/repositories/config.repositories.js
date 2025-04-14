import { query } from "../utils/query.js";

/* -- Config table
CREATE TABLE config (
    sr_no SERIAL PRIMARY KEY,
    id UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
    key VARCHAR(50) NOT NULL UNIQUE, -- MAX_CHAIN_DIETITIAN (max number of dietitian admin can have in his single line)
    type VARCHAR(50) NOT NULL CHECK (type IN ('string', 'number', 'boolean', 'json')), -- number
    name VARCHAR(50) NOT NULL, -- Max Downline Dietitian
    value INT NOT NULL -- 2
); */

export const createConfig = async ({key, type, name, value}) => {
    const sql = `
        INSERT INTO config (key, type, name, value)
        VALUES ($1, $2, $3, $4)
        RETURNING *
    `;
    const values = [key, type, name, value];
    const [result] = await query(sql, values);
    return result;
};

export const getConfigs = async () => {
    const sql = `
        SELECT * FROM config
    `;
    const result = await query(sql);
    return result;
};

export const getConfigByKey = async (key) => {
    const sql = `
        SELECT * FROM config WHERE key = $1
    `;
    const values = [key];
    const [result] = await query(sql, values);
    return result;
};

export const getConfigById = async (id) => {
    const sql = `
        SELECT * FROM config WHERE id = $1
    `;
    const values = [id];
    const [result] = await query(sql, values);
    return result;
};

export const updateConfig = async (id, {key, type, name, value}) => {
    const sql = `
        UPDATE config SET key = $1, type = $2, name = $3, value = $4 WHERE id = $5
        RETURNING *
    `;
    const values = [key, type, name, value, id];
    const [result] = await query(sql, values);
    return result;
};