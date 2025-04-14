import { query } from "../utils/query.js";

export const getChildrensByUserId = async (userId) => {
    const sql = `SELECT id, username, first_name, last_name, email, phone, gender, parent_id FROM users WHERE parent_id = $1`;
    const results = await query(sql, [userId]);
    return results;
}

export const getParentByUserId = async (userId) => {
    const sql = `SELECT id, username, first_name, last_name, email, phone, gender, parent_id FROM users WHERE id = $1`;
    const [result] = await query(sql, [userId]);
    return result;
}