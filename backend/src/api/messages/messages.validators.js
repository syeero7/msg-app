import { param, body } from "express-validator";
import _validateImage from "../../middleware/validate-image.js";
import { upload } from "../../config/multer.js";
import {
  IMAGE_DIMENSIONS,
  MAX_IMAGE_UPLOAD_SIZE,
  VALIDATION_ERROR_MESSAGE,
} from "../../utils/constants.js";

export const paramsValidator = [
  param("*").toInt().isNumeric().withMessage("invalid param type"),
];

export const messageValidator = [
  body("text")
    .notEmpty()
    .withMessage("Message must not be empty")
    .isLength({ max: 1000 })
    .withMessage(`Message ${VALIDATION_ERROR_MESSAGE.maxLength(1000)}`),
];

export const validateImage = _validateImage(
  upload.single("image"),
  MAX_IMAGE_UPLOAD_SIZE,
  IMAGE_DIMENSIONS.width,
  IMAGE_DIMENSIONS.height,
  ">"
);
