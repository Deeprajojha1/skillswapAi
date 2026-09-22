import ApiError from '../utils/ApiError.js';
import User from '../models/User.js';
import { USER_ROLES } from '../utils/constants.js';

const DEMO_USERS = {
  [USER_ROLES.CLIENT]: {
    name: 'Demo Client',
    email: 'demo.client@skillswap.local',
    password: 'demo-password',
    role: USER_ROLES.CLIENT,
  },
  [USER_ROLES.CREATOR]: {
    name: 'Demo Creator',
    email: 'demo.creator@skillswap.local',
    password: 'demo-password',
    role: USER_ROLES.CREATOR,
  },
  [USER_ROLES.ADMIN]: {
    name: 'Demo Admin',
    email: 'demo.admin@skillswap.local',
    password: 'demo-password',
    role: USER_ROLES.ADMIN,
  },
};

function selectedRole(req) {
  const role = req.headers['x-skillswap-role'];
  return Object.values(USER_ROLES).includes(role) ? role : USER_ROLES.CLIENT;
}

async function getDemoUser(role) {
  const demo = DEMO_USERS[role] || DEMO_USERS[USER_ROLES.CLIENT];
  return User.findOneAndUpdate(
    { email: demo.email },
    { $setOnInsert: demo },
    { new: true, upsert: true, setDefaultsOnInsert: true },
  );
}

export async function requireAuth(req, _res, next) {
  try {
    const user = await getDemoUser(selectedRole(req));
    req.user = user;
    return next();
  } catch (error) {
    return next(error.statusCode ? error : new ApiError(500, 'Could not resolve demo user'));
  }
}

export async function optionalAuth(req, _res, next) {
  try {
    req.user = await getDemoUser(selectedRole(req));
    return next();
  } catch {
    return next();
  }
}
