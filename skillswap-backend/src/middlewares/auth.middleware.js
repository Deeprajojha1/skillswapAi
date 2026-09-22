import ApiError from '../utils/ApiError.js';
import { verifyToken } from '../utils/jwt.js';
import User from '../models/User.js';
import { env } from '../config/env.js';

export async function requireAuth(req, _res, next) {
  try {
    const header = req.headers.authorization ?? '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : req.cookies?.[env.jwtCookieName];
    if (!token) throw new ApiError(401, 'Authentication required');
    const payload = verifyToken(token);
    const user = await User.findById(payload.sub);
    if (!user) throw new ApiError(401, 'User no longer exists');
    req.user = user;
    return next();
  } catch (error) {
    return next(error.statusCode ? error : new ApiError(401, 'Invalid or expired token'));
  }
}
