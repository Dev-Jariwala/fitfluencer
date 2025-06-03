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
    gender varchar(20) check (gender in ('male', 'female')) NOT NULL,
    dob DATE NOT NULL,
    height INT NOT NULL,
    weight INT NOT NULL,
    fitness_goal varchar(20),
    address VARCHAR(255) NOT NULL,
    city VARCHAR(50) NOT NULL,
    state VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_by UUID REFERENCES users(id),
    parent_id UUID REFERENCES users(id)
); */

/* -- Tokens table
CREATE TABLE tokens (
    sr_no SERIAL PRIMARY KEY,
    id UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
    token TEXT UNIQUE NOT NULL,
    token_type VARCHAR(50) NOT NULL, -- e.g., 'email_verification', 'phone_verification', 'password_reset', 'magic_link', 'invite_client'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    expires_at TIMESTAMP NOT NULL,
    is_consumed BOOLEAN DEFAULT FALSE,
    additional_data JSONB -- Store extra data like phone number, or other data
); */

export const createUser = async ({ username, email, phone, firstName, lastName, password, roleId, createdBy, parentId = null, gender, dob, address, city, state }) => {
    const sql = `
        INSERT INTO users (username, email, phone, first_name, last_name, password, role_id, created_by, parent_id, gender, date_of_birth, address, city, state)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        RETURNING *
    `;
    const values = [username, email, phone, firstName, lastName, password, roleId, createdBy, parentId, gender, dob, address, city, state];
    const [result] = await query(sql, values);
    return result;
};

// createUser({username: 'Admin', phone: '7990176865', firstName:'Dev', lastName: 'Jariwala', password: '$2a$10$8hRSH5qfMUTQ0ZUFWdLQtO7/8d68hBOeL9OkWaMbYFuUja3DyRJP.', roleId: "2a0b7d62-3414-4c29-885f-67c2be965727", created_by: null, parent_id: null, gender: 'male', dob: '2002-11-15', address: '123 Main St', city: 'Anytown', state: 'CA'}).then(console.log).catch(console.log)

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

export const updateUser = async (id, { username, email, phone, password, role_id, updated_by, parent_id = null, gender, dob, height, weight, fitnessGoal, address, city, state }) => {
    const sql = `
        UPDATE users SET username = $1, email = $2, phone = $3, password = $4, role_id = $5, updated_by = $6, parent_id = $7, gender = $8, date_of_birth = $9, height = $10, weight = $11, fitness_goal = $12, address = $13, city = $14, state = $15, updated_at = NOW() WHERE id = $16
    `;
    const values = [username, email, phone, password, role_id, updated_by, parent_id, gender, dob, height, weight, fitnessGoal, address, city, state, id];
    const [result] = await query(sql, values);
    return result;
};

export const markUserRegistered = async (id) => {
    const sql = `
        UPDATE users SET is_registered = TRUE WHERE id = $1
    `;
    const values = [id];
    const [result] = await query(sql, values);
    return result;
};

export const getUserDepth = async (userId) => {
    const sql = `
        WITH RECURSIVE hierarchy AS (
            SELECT id, parent_id, 0 AS depth FROM users WHERE id = $1
            UNION ALL
            SELECT u.id, u.parent_id, h.depth + 1
            FROM users u
            INNER JOIN hierarchy h ON u.id = h.parent_id
        )
        SELECT depth FROM hierarchy ORDER BY depth DESC LIMIT 1;
    `;
    const values = [userId];
    const [result] = await query(sql, values);
    return result ? result.depth : null; // If userId does not exist, return null
};

export const createToken = async ({ token, token_type, created_by, expires_at, additional_data = null }) => {
    const sql = `
        INSERT INTO tokens (token, token_type, created_by, expires_at, additional_data)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
    `;
    const values = [token, token_type, created_by, expires_at, additional_data];
    const [result] = await query(sql, values);
    return result;
};

export const getTokenByToken = async (token) => {
    const sql = `
        SELECT * FROM tokens WHERE token = $1
    `;
    const values = [token];
    const [result] = await query(sql, values);
    return result;
};

export const getTokenById = async (id) => {
    const sql = `
        SELECT * FROM tokens WHERE id = $1
    `;
    const values = [id];
    const [result] = await query(sql, values);
    return result;
};

export const updateToken = async (id, { token, token_type, expires_at, is_consumed, additional_data = null }) => {
    const sql = `
        UPDATE tokens SET token = $1, token_type = $2, expires_at = $3, is_consumed = $4, additional_data = $5 WHERE id = $6
    `;
    const values = [token, token_type, expires_at, is_consumed, additional_data, id];
    const [result] = await query(sql, values);
    return result;
};

export const deleteToken = async (id) => {
    const sql = `
        DELETE FROM tokens WHERE id = $1
    `;
    const values = [id];
    const [result] = await query(sql, values);
    return result;
};

export const getInviteLinksHistory = async (userId) => {
    const sql = `
        SELECT * FROM tokens WHERE token_type = 'invite' AND created_by = $1 ORDER BY created_at DESC
    `;
    const values = [userId];
    const result = await query(sql, values);
    return result;
};


// here create a funnction that takes a userId and returns the parentId and all the childrens of the user
export const getUserChildrensByUserId = async (userId) => {
    console.log("userId in getUserChildrensByUserId", userId);
    const sql = `
        WITH RECURSIVE user_hierarchy AS (
            SELECT *
            FROM users
            WHERE id = $1

        UNION ALL

            SELECT u.*
            FROM users u
            INNER JOIN user_hierarchy uh ON u.parent_id = uh.id
        )
        SELECT * FROM user_hierarchy WHERE id != $1;
    `;
    const values = [userId];
    const result = await query(sql, values);
    return result;
};

export const getUserFamilyTree = async (userId) => {
    console.log("userId in getUserFamilyTree", userId);
    const sql = `
    WITH RECURSIVE ancestors AS (
        SELECT u.id, u.username, u.phone, u.first_name, u.last_name, u.role_id, u.gender, u.parent_id
        FROM users u
        WHERE id = $1
        UNION ALL
        SELECT u.id, u.username, u.phone, u.first_name, u.last_name, u.role_id, u.gender, u.parent_id
        FROM users u
        INNER JOIN ancestors a ON a.parent_id = u.id
    ),
    descendants AS (
        SELECT u.id, u.username, u.phone, u.first_name, u.last_name, u.role_id, u.gender, u.parent_id
        FROM users u
        WHERE id = $1
        UNION ALL
        SELECT u.id, u.username, u.phone, u.first_name, u.last_name, u.role_id, u.gender, u.parent_id
        FROM users u
        INNER JOIN descendants d ON u.parent_id = d.id
    )
    SELECT * FROM (
        SELECT * FROM ancestors
        UNION
        SELECT * FROM descendants
    ) AS family_tree;
`;
    const values = [userId];
    const result = await query(sql, values);
    return result;
};

export const getUserParentHierarchy = async (userId) => {
    // Get all parents in the hierarchy chain
    const sql = `
        WITH RECURSIVE parent_hierarchy AS (
            SELECT id, parent_id, username, first_name, last_name, role_id
            FROM users
            WHERE id = $1
            
            UNION ALL
            
            SELECT u.id, u.parent_id, u.username, u.first_name, u.last_name, u.role_id
            FROM users u
            INNER JOIN parent_hierarchy ph ON u.id = ph.parent_id
            WHERE u.id IS NOT NULL
        )
        SELECT id, parent_id, username, first_name, last_name, role_id
        FROM parent_hierarchy 
        WHERE id != $1;
    `;

    const result = await query(sql, [userId]);
    return result;
}
