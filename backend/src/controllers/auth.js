import { validationResult, body } from "express-validator";
import asyncHandler from "express-async-handler";
import passport from "passport";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import prisma from "../lib/prisma-client.js";

export const signUp = [
  body("firstName")
    .trim()
    .isAlpha()
    .withMessage("First name must only contain letters")
    .isLength({ max: 50 })
    .withMessage("First name cannot exceed 50 characters"),
  body("lastName")
    .trim()
    .isAlpha()
    .withMessage("Last name must only contain letters")
    .isLength({ max: 50 })
    .withMessage("Last name cannot exceed 50 characters"),
  body("email")
    .trim()
    .isEmail()
    .withMessage("Email must be formatted properly")
    .custom(async (value) => {
      const user = await prisma.user.findUnique({ where: { email: value } });
      return user === null;
    })
    .withMessage("Email already in use"),
  body("password")
    .isLength({ min: 6, max: 25 })
    .withMessage("Password must be between 6 and 20 characters"),
  body("confirmPassword")
    .custom((value, { req }) => value === req.body.password)
    .withMessage("Passwords do not match"),
  asyncHandler(async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      const formatted = result.formatWith(({ msg }) => msg);
      return res.status(400).json({ errors: formatted.mapped() });
    }

    const { firstName, lastName, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
      },
    });

    res.sendStatus(201);
  }),
];

export const login = asyncHandler(async (req, res, next) => {
  passport.authenticate(
    "local",
    { session: false },
    async (error, user, info) => {
      if (error) return next(error);
      if (!user) return res.status(401).json({ message: info.message });

      const token = jwt.sign({ uid: user.id }, process.env.SECRET);

      res.json({ token, user: { id: user.id, email: user.email } });
    }
  )(req, res, next);
});
