import ApiError from '../utils/ApiError.js';

export const validate = (schema, source = 'body') => (req, _res, next) => {
  const result = schema.safeParse(req[source]);
  if (!result.success) {
    return next(new ApiError(400, 'Validation failed', result.error.issues.map((issue) => issue.message)));
  }
  if (source === 'query') {
    Object.assign(req.query, result.data);
  } else {
    req[source] = result.data;
  }
  return next();
};
