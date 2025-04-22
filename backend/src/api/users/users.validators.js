import { body, param } from "express-validator";
import { upload } from "../../config/multer.js";
import validateImage from "../../middleware/validate-image.js";

const AVATAR_MAX_UPLOAD_SIZE = 3; //file size  MB
const AVATAR_SIZE = 300; // width & height  px

export const paramsValidator = [
  param("userId").toInt().isNumeric().withMessage("invalid param type"),
];

export const userDetailsValidator = [
  body("aboutMe")
    .isLength({ max: 200 })
    .withMessage("About Me cannot exceed 200 characters"),
];

export const validateAvatar = validateImage(
  upload.single("avatar"),
  AVATAR_MAX_UPLOAD_SIZE,
  AVATAR_SIZE,
  AVATAR_SIZE,
  "!=="
);
