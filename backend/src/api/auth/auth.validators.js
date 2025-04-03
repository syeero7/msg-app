import { body } from "express-validator";
import { VALIDATION_ERROR_MESSAGE } from "../../utils/constants.js";
import prisma from "../../config/prisma-client.js";

export const authValidator = [
  body("firstName")
    .trim()
    .isAlpha()
    .withMessage(`First name ${VALIDATION_ERROR_MESSAGE.letter}`)
    .isLength({ max: 50 })
    .withMessage(`First name ${VALIDATION_ERROR_MESSAGE.maxLength(50)}`),
  body("lastName")
    .trim()
    .isAlpha()
    .withMessage(`Last name ${VALIDATION_ERROR_MESSAGE.letter}`)
    .isLength({ max: 50 })
    .withMessage(`Last name ${VALIDATION_ERROR_MESSAGE.maxLength(50)}`),
  body("email")
    .trim()
    .isEmail()
    .withMessage("E-mail must be formatted properly")
    .custom(async (value) => {
      const user = await prisma.user.findUnique({ where: { email: value } });
      if (user) throw new Error("E-mail already in use");
    }),
  body("password")
    .isLength({ min: 6, max: 25 })
    .withMessage(VALIDATION_ERROR_MESSAGE.lengthRange(6, 25)),
  body("confirmPassword")
    .custom((value, { req }) => value === req.body.password)
    .withMessage("Passwords do not match"),
];
