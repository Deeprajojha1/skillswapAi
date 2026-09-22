export function sendSuccess(res, data = null, message = 'OK', statusCode = 200) {
  return res.status(statusCode).json({ success: true, message, data });
}

export function sendCreated(res, data = null, message = 'Created') {
  return sendSuccess(res, data, message, 201);
}
