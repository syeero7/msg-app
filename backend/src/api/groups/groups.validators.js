import { body, param } from "express-validator";

export const paramValidator = [
  param("*").toInt().isNumeric().withMessage("invalid param type"),
];

export const newGroupValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name must not be empty")
    .isAlpha("en-US", { ignore: /\s/ })
    .withMessage("Name must only contain letters")
    .isLength({ max: 20 })
    .withMessage("Name cannot exceed 20 characters"),
];
