import multer from 'multer';
import ApiError from '../utils/ApiError.js';
import cloudinary, { isCloudinaryConfigured } from '../config/cloudinary.js';

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) return cb(new ApiError(400, 'Only image uploads are allowed'));
    return cb(null, true);
  },
});

export async function uploadImageToCloudinary(req, _res, next) {
  try {
    if (!req.file) return next();
    if (!isCloudinaryConfigured()) {
      req.uploadedImage = {
        url: `local-upload://${req.file.originalname}`,
        publicId: null,
      };
      return next();
    }

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'skillswap/gigs', resource_type: 'image' },
        (error, uploadResult) => (error ? reject(error) : resolve(uploadResult)),
      );
      stream.end(req.file.buffer);
    });

    req.uploadedImage = { url: result.secure_url, publicId: result.public_id };
    return next();
  } catch (error) {
    return next(error);
  }
}
