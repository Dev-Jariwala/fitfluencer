import "../logger.js";
import winston from "winston";
import passport from "passport";
import jwt from "jsonwebtoken";
import { query } from "../utils/query.js";
import * as userRepositories from '../repositories/user.repositories.js';
import * as rolesRepositories from '../repositories/roles.repositories.js';
const errorLogger = winston.loggers.get("error-logger");

// userRepositories.createUser({username: 'admin', email: 'devjariwala.j@gmail.com', phone: '7990176865', password: 'admin', role_id: '20d1b304-17b3-4752-b545-fa96cb57eec7', created_by: null, parent_id: null}).then(console.log).catch(console.log)
// rolesRepositories.createRole({key: 'admin', name: 'admin', description: 'admin', created_by: null}).then(console.log).catch(console.log)
export const loginUser = (req, res, next) => {
  try {
    passport.authenticate("local", { session: false }, (err, user, info) => {
      if (err) return res.status(400).json(err);
      if (!user) return res.status(401).json({ message: "User not found" });

      req.login(user, { session: false }, (err) => {
        if (err) return res.status(400).json(err);

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
          data: user,
          message: "Login successful",
          isAuthenticated: true
        });
      });
    })(req, res, next);
  } catch (error) {
    errorLogger.error(error);
    console.log(error);
    res.status(500).json({ message: error.message, error });
  }
};

export const authenticateUser = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userRepositories.getUserById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    return res.status(200).json({ message: 'Authenticated', data: user, token, isAuthenticated: true });
  } catch (error) {
    errorLogger.error(error);
    console.log(error);
    res.status(500).json({ message: error.message, error });
  }
};


export const logoutUser = (req, res, next) => {
  res.clearCookie('token');
  res.status(200).json({ message: 'Logged out successfully' });
};

