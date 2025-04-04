import { body, param } from "express-validator";
import { VALIDATION_ERROR_MESSAGE } from "../../utils/constants.js";

export const userValidator = [
  param("userId").toInt().isNumeric().withMessage("invalid param type"),
  body("aboutMe")
    .optional({ values: "undefined" })
    .isLength({ max: 200 })
    .withMessage(`About Me ${VALIDATION_ERROR_MESSAGE.maxLength(200)}`),
];
