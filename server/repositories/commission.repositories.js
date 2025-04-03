import { query } from "../utils/query.js";

/* -- Commission table
CREATE TABLE commission (
    sr_no SERIAL PRIMARY KEY,
    id UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
    type VARCHAR(50) CHECK (type IN ('dietitian', 'corporate_client')),
    max_downline INT NOT NULL,  -- This will allow us to track the number of downlines
    level INT NOT NULL CHECK (level BETWEEN 0 AND max_downline),  -- 1 for first-layer, 2 for second-layer, etc.
    role_id UUID NOT NULL REFERENCES roles(id),
    commission_percentage DECIMAL(5,2) NOT NULL CHECK (commission_percentage BETWEEN 0 AND 100),  -- Percentage for commission
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (type,max_downline, level, role_id)
); */

export const createCommission = async ({ type, max_downline, level, role_id, commission_percentage }) => {
    const sql = `
        INSERT INTO commission (type, max_downline, level, role_id, commission_percentage)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
    `;
    const values = [type, max_downline, level, role_id, commission_percentage];
    const [result] = await query(sql, values);
    return result;
};

export const getCommissions = async () => {
    const sql = `
        SELECT * FROM commission
    `;
    const result = await query(sql);
    return result;
};

export const getCommissionByKeys = async (type, max_downline) => {
    const sql = `
        SELECT * FROM commission WHERE type = $1 AND max_downline = $2
    `;
    const values = [type, max_downline];
    const result = await query(sql, values);
    return result;
};

export const getCommissionByTypeAndMaxDownlineAndLevelAndRoleId = async (type, max_downline, level, role_id) => {
    const sql = `
        SELECT * FROM commission WHERE type = $1 AND max_downline = $2 AND level = $3 AND role_id = $4
    `;
    const values = [type, max_downline, level, role_id];
    const [result] = await query(sql, values);
    return result;
};

export const updateCommission = async (id, { type, max_downline, level, role_id, commission_percentage }) => {
    const sql = `
        UPDATE commission SET type = $1, max_downline = $2, level = $3, role_id = $4, commission_percentage = $5 WHERE id = $6
    `;
    const values = [type, max_downline, level, role_id, commission_percentage, id];
    const [result] = await query(sql, values);
    return result;
};