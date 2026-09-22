import { loginUser, registerUser } from '../services/auth.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { env } from '../config/env.js';
import { cookieOptions } from '../utils/jwt.js';
import { sendCreated, sendSuccess } from '../utils/response.js';

export const register = asyncHandler(async (req, res) => {
  const data = await registerUser(req.body);
  res.cookie(env.jwtCookieName, data.token, cookieOptions());
  sendCreated(res, data, 'Registered successfully');
});

export const login = asyncHandler(async (req, res) => {
  const data = await loginUser(req.body);
  res.cookie(env.jwtCookieName, data.token, cookieOptions());
  sendSuccess(res, data, 'Logged in successfully');
});

export const logout = asyncHandler(async (_req, res) => {
  res.clearCookie(env.jwtCookieName, cookieOptions());
  sendSuccess(res, null, 'Logged out successfully');
});
