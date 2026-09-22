import User from '../models/User.js';

export function getUserProfile(id) {
  return User.findById(id);
}

export function updateUserProfile(id, payload) {
  const allowed = ['name', 'bio', 'skills'];
  const update = Object.fromEntries(Object.entries(payload).filter(([key]) => allowed.includes(key)));
  return User.findByIdAndUpdate(id, update, { new: true, runValidators: true });
}
