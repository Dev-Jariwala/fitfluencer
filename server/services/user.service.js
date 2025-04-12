import * as userRepositories from '../repositories/user.repositories.js';
import * as rolesRepositories from '../repositories/roles.repositories.js';
import jwt from 'jsonwebtoken';

export const verifyInviteToken = async (token) => {
    const tokenData = await userRepositories.getTokenByToken(token);
    if(!tokenData) return { success: false, message: 'Invalid Link', statusCode: 400 };

    // check if token is expired
    if(tokenData.expires_at < new Date()) return { success: false, message: 'Link expired', statusCode: 400 };

    // check if token is consumed
    if(tokenData.is_consumed) return { success: false, message: 'Link already consumed', statusCode: 400 };
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { userId, roleId } = decoded;

    if(tokenData.token_type !== 'invite') return { success: false, message: 'Invalid token type', statusCode: 400 };
    if(tokenData.additional_data.roleId !== roleId) return { success: false, message: 'Invalid role ID', statusCode: 400 };
    if(tokenData.created_by !== userId) return { success: false, message: 'Invalid link', statusCode: 400 };

    const user = await userRepositories.getUserById(userId);
    if(!user) return { success: false, message: 'User not found', statusCode: 400 };

    const role = await rolesRepositories.getRoleById(roleId);
    if(!role) return { success: false, message: 'Role not found', statusCode: 400 };

    if(!['dietitian', 'client'].includes(role.key)) return { success: false, message: 'Invalid role ID', statusCode: 400 };

    return { success: true, message: 'Link verified', data: tokenData, statusCode: 200 };
}
