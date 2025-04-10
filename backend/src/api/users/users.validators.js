import { body, param } from "express-validator";
import { upload } from "../../config/multer.js";
import validateImage from "../../middleware/validate-image.js";
import {
  VALIDATION_ERROR_MESSAGE,
  AVATAR_DIMENSIONS,
  MAX_AVATAR_UPLOAD_SIZE,
} from "../../utils/constants.js";

export const paramsValidator = [
  param("userId").toInt().isNumeric().withMessage("invalid param type"),
];

export const userDetailsValidator = [
  body("aboutMe")
    .isLength({ max: 200 })
    .withMessage(`About Me ${VALIDATION_ERROR_MESSAGE.maxLength(200)}`),
];

export const validateAvatar = validateImage(
  upload.single("avatar"),
  MAX_AVATAR_UPLOAD_SIZE,
  AVATAR_DIMENSIONS.width,
  AVATAR_DIMENSIONS.height,
  "!=="
);
