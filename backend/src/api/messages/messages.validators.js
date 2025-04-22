import { param, body } from "express-validator";
import _validateImage from "../../middleware/validate-image.js";
import { upload } from "../../config/multer.js";

const IMAGE_MAX_UPLOAD_SIZE = 5; // file size  MB
const IMAGE_MAX_SIZE = 2000; // width & height  px

export const paramsValidator = [
  param("*").toInt().isNumeric().withMessage("invalid param type"),
];

export const messageValidator = [
  body("text")
    .notEmpty()
    .withMessage("Message must not be empty")
    .isLength({ max: 1000 })
    .withMessage("Message cannot exceed 1000 characters"),
];

export const validateImage = _validateImage(
  upload.single("image"),
  IMAGE_MAX_UPLOAD_SIZE,
  IMAGE_MAX_SIZE,
  IMAGE_MAX_SIZE,
  ">"
);
