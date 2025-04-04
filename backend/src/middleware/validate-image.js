import sharp from "sharp";
import {
  UPLOAD_IMAGE_SIZE_IN_PIXELS as UPLOAD_IMAGE_SIZE,
  MAX_FILE_UPLOAD_SIZE_IN_MEGA_BYTES as MAX_FILE_SIZE,
} from "../utils/constants.js";

const validateImage = (multer) => {
  return [
    multer,
    async (req, res, next) => {
      if (!req.file) {
        const err = new Error("No upload file");
        err.statusCode = 400;
        return next(err);
      }

      const { mimetype, size, buffer } = req.file;
      const imageTypes = ["image/jpg", "image/jpeg", "image/png"];

      if (!imageTypes.includes(mimetype)) {
        const err = new Error("File format must be either JPEG or PNG");
        err.statusCode = 400;
        return next(err);
      }

      if (size / (1024 * 1024) > MAX_FILE_SIZE) {
        const err = new Error(
          `File size exceeds the maximum limit of ${MAX_FILE_SIZE}MB`
        );
        err.statusCode = 400;
        return next(err);
      }

      const { height, width } = await sharp(buffer).metadata();
      if (height !== UPLOAD_IMAGE_SIZE || width !== UPLOAD_IMAGE_SIZE) {
        const err = new Error(`uploaded image size must be ${UPLOAD_IMAGE_SIZE}px`);
        err.statusCode = 400;
        return next(err);
      }

      next();
    },
  ];
};

export default validateImage;
