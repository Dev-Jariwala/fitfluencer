import * as userRepositories from '../repositories/user.repositories.js';
import * as rolesRepositories from '../repositories/roles.repositories.js';
import * as commissionRepositories from '../repositories/commission.repositories.js';
import * as incomeRepositories from '../repositories/income.repositories.js';
import jwt from 'jsonwebtoken';

export const verifyInviteToken = async (token) => {
    const tokenData = await userRepositories.getTokenByToken(token);
    if (!tokenData) return { success: false, message: 'Invalid Link', statusCode: 400 };

    // check if token is expired
    if (tokenData.expires_at < new Date()) return { success: false, message: 'Link expired', statusCode: 400 };

    // check if token is consumed
    if (tokenData.is_consumed) return { success: false, message: 'Link already consumed', statusCode: 400 };

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { userId, roleId } = decoded;

    if (tokenData.token_type !== 'invite') return { success: false, message: 'Invalid token type', statusCode: 400 };
    if (tokenData.additional_data.roleId !== roleId) return { success: false, message: 'Invalid role ID', statusCode: 400 };
    if (tokenData.created_by !== userId) return { success: false, message: 'Invalid link', statusCode: 400 };

    const user = await userRepositories.getUserById(userId);
    if (!user) return { success: false, message: 'User not found', statusCode: 400 };

    const role = await rolesRepositories.getRoleById(roleId);
    if (!role) return { success: false, message: 'Role not found', statusCode: 400 };

    if (!['dietitian', 'client'].includes(role.key)) return { success: false, message: 'Invalid role ID', statusCode: 400 };

    return { success: true, message: 'Link verified', data: tokenData, statusCode: 200 };
}

export const getUserParentHierarchy = async (userId) => {
    console.log("userId in getUserParentHierarchy", userId);

    // First get the user's own data
    const user = await userRepositories.getUserById(userId);

    if (!user) {
        return []; // Return empty array if user not found
    }

    const rawParents = await userRepositories.getUserParentHierarchy(userId);

    if (rawParents.length === 0) {
        return []; // No parents found
    }

    // Create a parent chain from top to bottom
    let parentChain = [];
    let currentId = user.parent_id;

    // Build the parent chain (top parent will be last)
    while (currentId) {
        const parent = rawParents.find(p => p.id === currentId);
        if (!parent) break;

        parentChain.push(parent);
        currentId = parent.parent_id;
    }

    // Reverse the chain so top parent is first (index 0)
    parentChain.reverse();

    // Assign depths (top parent = 0, increasing as we go down)
    const result = parentChain.map((parent, index) => ({
        ...parent,
        depth: index
    }));

    return result;
};

export const createUserParentHierarchyIncome = async (userId, paymentId, amount, fee) => {
    const user = await userRepositories.getUserById(userId);
    if (!user) return { success: false, message: 'User not found', statusCode: 400 };

    const roles = await rolesRepositories.getRoles();
    const clientRole = roles.find(role => role.key === 'client');
    if (!clientRole) return { success: false, message: 'Client role not found', statusCode: 400 };
    if (user.role_id !== clientRole.id) return { success: false, message: 'User is not a client', statusCode: 400 };

    const parentHierarchy = await getUserParentHierarchy(userId);
    if (parentHierarchy.length === 0) return { success: false, message: 'User has no parent', statusCode: 400 };

    const lastParentRoleId = parentHierarchy[parentHierarchy.length - 1].role_id;
    const lastParentRole = roles.find(role => role.id === lastParentRoleId);
    if (!lastParentRole) return { success: false, message: 'Last parent role not found', statusCode: 400 };

    const commissionType = lastParentRole.key;
    // console.log("commissionType", commissionType);

    const parentHierarchyIncome = await Promise.all(parentHierarchy.map(async (parent) => {
        const parentUser = await userRepositories.getUserById(parent.id);
        if (!parentUser) return { success: false, message: 'Parent user not found', statusCode: 400 };
        // console.log("parentUser", parentUser);
        const parentRole = roles.find(role => role.id === parentUser.role_id);
        // console.log("parentRole", parentRole);
        if (!parentRole) return { success: false, message: 'Parent role not found', statusCode: 400 };
        if (!['admin', 'dietitian'].includes(parentRole.key)) return { success: false, message: 'Parent role is not admin or dietitian', statusCode: 400 };

        const commission = await commissionRepositories.getCommissionByTypeAndTotalDownlineAndForDownline(commissionType, parentHierarchy.length - 1, parent.depth);
        if (!commission) return { success: false, message: 'Commission not found', statusCode: 400 };
        // console.log("commission", commission);

        const commissionAmount = amount * parseFloat(commission.commission_percentage) / 100;
        // console.log("commissionAmount", commissionAmount);
        const data = {
            userId: parentUser.id,
            amount: parentRole.key === 'admin' ? commissionAmount - fee : commissionAmount,
            commissionPercentage: commission.commission_percentage,
            paymentId: paymentId,
            fee: parentRole.key === 'admin' ? fee : 0,
            layer: commission.for_downline
        };
        console.log("data", data);

        await incomeRepositories.createIncome(data);
        return {
            success: true, message: 'Parent hierarchy income created', statusCode: 200, data
        };
    }));

    return { success: true, message: 'User parent hierarchy income created', statusCode: 200, data: parentHierarchyIncome };
}

// createUserParentHierarchyIncome('e747fec7-dfd5-43a8-85e8-50e3aa833b31', '1234567890', 10000, 100).then(console.log).catch(console.error);
