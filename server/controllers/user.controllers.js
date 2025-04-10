import "../logger.js";
import winston from "winston";
import passport from "passport";
import jwt from "jsonwebtoken";
import { query } from "../utils/query.js";
import * as userRepositories from '../repositories/user.repositories.js';
import * as configRepositories from '../repositories/config.repositories.js';
import * as rolesRepositories from '../repositories/roles.repositories.js';
import { handleError } from "../utils/error.js";
import * as userService from "../services/user.service.js";
import bcrypt from "bcrypt";

// userRepositories.createUser({username: 'admin', email: 'devjariwala.j@gmail.com', phone: '7990176865', password: 'admin', role_id: '20d1b304-17b3-4752-b545-fa96cb57eec7', created_by: null, parent_id: null}).then(console.log).catch(console.log)
// rolesRepositories.createRole({key: 'admin', name: 'admin', description: 'admin', created_by: null}).then(console.log).catch(console.log)
export const loginUser = (req, res, next) => {
  try {
    passport.authenticate("local", { session: false }, (err, user, info) => {
      if (err) return res.status(400).json(err);
      if (!user) return res.status(401).json({ message: "User not found" });

      req.login(user, { session: false }, async (err) => {
        if (err) return res.status(400).json(err);

        const userRole = await rolesRepositories.getRoleById(user.role_id);
        if (!userRole) return res.status(400).json({ message: "User role not found" });

        const token = jwt.sign(
          { ...user },
          process.env.JWT_SECRET,
          {
            // expiresIn: 60 * 60,
          }
        );
        res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'none' });
        return res.json({
          token,
          data: { ...user, role: userRole },
          message: "Login successful",
          isAuthenticated: true
        });
      });
    })(req, res, next);
  } catch (error) {
    handleError("loginUser", res, error);
  }
};

export const authenticateUser = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: 'Unauthorized' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userRepositories.getUserById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const userRole = await rolesRepositories.getRoleById(user.role_id);
    if (!userRole) return res.status(400).json({ message: "User role not found" });

    return res.status(200).json({ message: 'Authenticated', data: { ...user, role: userRole }, token, isAuthenticated: true });
  } catch (error) {
    handleError("authenticateUser", res, error);
  }
};


export const logoutUser = (req, res, next) => {
  res.clearCookie('token');
  res.status(200).json({ message: 'Logged out successfully' });
};

const canInviteDietitian = async ({ userId, userRoleId }) => {
  const role = await rolesRepositories.getRoleById(userRoleId);
  if (!role) return { success: false, message: 'User role not found' };
  if (!['admin', 'dietitian'].includes(role.key)) return { success: false, message: 'User is not authorized to generate invite link' };
  const maxChainDietitian = await configRepositories.getConfigByKey('MAX_CHAIN_DIETITIAN');
  if (!maxChainDietitian) return { success: false, message: 'Max chain dietitian not found' };
  const userDepth = await userRepositories.getUserDepth(userId);
  if (userDepth > maxChainDietitian) return { success: false, message: 'Max chain dietitian reached' };
  return { success: true, message: 'User can invite users', data: { maxChainDietitian, userDepth } };
}

export const getCanInviteDietitian = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const userRoleId = req.user.role_id;
    const result = await canInviteDietitian({ userId, userRoleId });

    return res.status(200).json({ message: result.message, data: { canInviteDietitian: result.success } });
  } catch (error) {
    handleError("getCanInviteUsers", res, error);
  }
}
export const generateInviteLink = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const userRoleId = req.user.role_id;
    const { roleId } = req.body;

    const role = await rolesRepositories.getRoleById(userRoleId);
    if (!role) return res.status(400).json({ message: 'User role not found' });

    if (!['admin', 'dietitian'].includes(role.key)) {
      return res.status(400).json({ message: 'User is not authorized to generate invite link' });
    }

    const maxChainDietitian = await configRepositories.getConfigByKey('MAX_CHAIN_DIETITIAN');
    if (!maxChainDietitian) return res.status(400).json({ message: 'Max chain dietitian not found' });
    const userDepth = await userRepositories.getUserDepth(userId);
    if (userDepth > maxChainDietitian) return res.status(400).json({ message: 'Max chain dietitian reached' });

    const expiresIn = 15 * 60 * 1000;

    const token = jwt.sign({ userId, roleId }, process.env.JWT_SECRET, { expiresIn });
    const expiresAt = new Date(Date.now() + expiresIn);

    const tokenData = await userRepositories.createToken({ token, token_type: 'invite', created_by: userId, expires_at: expiresAt, additional_data: { roleId } });
    if (!tokenData) return res.status(400).json({ message: 'Failed to create token' });

    const inviteLink = `${process.env.FRONTEND_URL}/register?token=${token}`;
    return res.status(200).json({ inviteLink, tokenData });
  } catch (error) {
    handleError("generateInviteLink", res, error);
  }
};

export const verifyInviteLink = async (req, res) => {
  try {
    const { token } = req.body;
    const result = await userService.verifyInviteToken(token);
    if (!result.success) return res.status(result.statusCode).json({ message: result.message });

    return res.status(result.statusCode || 200).json({ message: result.message, data: result.data, isVerified: true });

  } catch (error) {
    handleError("verifyInviteLink", res, error);
  }
}

export const registerUser = async (req, res) => {
  try {
    const { token } = req.body;
    const result = await userService.verifyInviteToken(token);
    if (!result.success) return res.status(result.statusCode).json({ message: result.message });

    const { email, phone, username, firstName, lastName, password, gender, dob, height, weight, fitnessGoal, address, city, state } = req.body;
    const tokenData = result.data;

    const userEmail = await userRepositories.getUserByLoginId(email);
    if (userEmail) return res.status(400).json({ message: 'User with this email already exists' });

    const userPhone = await userRepositories.getUserByLoginId(phone);
    if (userPhone) return res.status(400).json({ message: 'User with this phone number already exists' });

    const userUserName = await userRepositories.getUserByLoginId(username);
    if (userUserName) return res.status(400).json({ message: 'User with this username already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userRepositories.createUser({ username, email, phone, firstName, lastName, password: hashedPassword, roleId: tokenData.additional_data.roleId, createdBy: tokenData.created_by, parentId: tokenData.created_by, gender, dob, height, weight, fitnessGoal, address, city, state });
    if (!user) return res.status(400).json({ message: 'Failed to create user' });

    await userRepositories.updateToken(tokenData.id, { token: tokenData.token, token_type: 'invite', expires_at: tokenData.expires_at, is_consumed: true, additional_data: { roleId: tokenData.additional_data.roleId, children_id: user.id } });

    const loginToken = jwt.sign(
      { ...user },
      process.env.JWT_SECRET,
      {
        // expiresIn: 60 * 60,
      }
    );
    res.cookie('token', loginToken, { httpOnly: true, secure: true, sameSite: 'none' });
    return res.json({
      token: loginToken,
      data: user,
      message: "User registered successfully",
      isAuthenticated: true
    });

  } catch (error) {
    handleError("registerUser", res, error);
  }
}

