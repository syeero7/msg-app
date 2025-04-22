import { body } from "express-validator";
import prisma from "../../config/prisma-client.js";

const LETTERS_ERROR = "must only contain letters";
const MAX_LENGTH_ERROR = "cannot exceed 50 characters";

export const authValidator = [
  body("firstName")
    .trim()
    .isAlpha()
    .withMessage(`First name ${LETTERS_ERROR}`)
    .isLength({ max: 50 })
    .withMessage(`First name ${MAX_LENGTH_ERROR}`),
  body("lastName")
    .trim()
    .isAlpha()
    .withMessage(`Last name ${LETTERS_ERROR}`)
    .isLength({ max: 50 })
    .withMessage(`Last name ${MAX_LENGTH_ERROR}`),
  body("email")
    .trim()
    .isEmail()
    .withMessage("Email must be formatted properly")
    .custom(async (value) => {
      const user = await prisma.user.findUnique({ where: { email: value } });
      if (user) throw new Error("E-mail already in use");
    }),
  body("password")
    .isLength({ min: 6, max: 25 })
    .withMessage("Password must be between 6 and 20 characters"),
  body("confirmPassword")
    .custom((value, { req }) => value === req.body.password)
    .withMessage("Passwords do not match"),
];
