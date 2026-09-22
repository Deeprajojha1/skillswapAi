import ApiError from '../utils/ApiError.js';
import { signToken } from '../utils/jwt.js';
import User from '../models/User.js';

function authPayload(user) {
  return {
    user,
    token: signToken({ sub: user.id, role: user.role }),
  };
}

export async function registerUser(payload) {
  const existing = await User.findOne({ email: payload.email });
  if (existing) throw new ApiError(409, 'Email is already registered');
  const user = await User.create(payload);
  return authPayload(user);
}

export async function loginUser({ email, password }) {
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, 'Invalid email or password');
  }
  return authPayload(user);
}
