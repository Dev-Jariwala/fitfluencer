import { query } from "../utils/query";

export const getChildrensByUserId = async (userId) => {
    const sql = `SELECT id, username, first_name, last_name, email, phone, gender, parent_id FROM users WHERE parent_id = ?`;
    const results = await query(sql, [userId]);
    return results;
}

export const getParentByUserId = async (userId) => {
    const sql = `SELECT id, username, first_name, last_name, email, phone, gender, parent_id FROM users WHERE id = ?`;
    const results = await query(sql, [userId]);
    return results;
}