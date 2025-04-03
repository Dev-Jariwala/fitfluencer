import { query } from "../utils/query.js";

/* -- Users table
CREATE TABLE users (
	sr_no SERIAL PRIMARY KEY,
	id UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
	username VARCHAR(50) NOT NULL UNIQUE,
	email VARCHAR(100) NOT NULL UNIQUE,
	phone VARCHAR(20) NOT NULL UNIQUE,
	password VARCHAR(255) NOT NULL,
	role_id UUID NOT NULL REFERENCES roles(id),
	created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
	updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_by UUID REFERENCES users(id),
    parent_id UUID REFERENCES users(id)
); */

export const createUser = async ({username, email, phone, password, role_id, created_by, parent_id = null}) => {
    const sql = `
        INSERT INTO users (username, email, phone, password, role_id, created_by, parent_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
    `;
    const values = [username, email, phone, password, role_id, created_by, parent_id];
    const [result] = await query(sql, values);
    return result;
};

export const getUserByLoginId = async (loginId) => {
    const sql = `
        SELECT * FROM users WHERE username = $1 OR email = $1 OR phone = $1`;
    const values = [loginId];
    const [result] = await query(sql, values);
    return result;
};

export const getUserById = async (id) => {
    const sql = `
        SELECT * FROM users WHERE id = $1
    `;
    const values = [id];
    const [result] = await query(sql, values);
    return result;
};

export const updateUser = async (id, {username, email, phone, password, role_id, updated_by, parent_id = null}) => {
    const sql = `
        UPDATE users SET username = $1, email = $2, phone = $3, password = $4, role_id = $5, updated_by = $6, parent_id = $7, updated_at = NOW() WHERE id = $8
    `;
    const values = [username, email, phone, password, role_id, updated_by, parent_id, id];
    const [result] = await query(sql, values);
    return result;
};
