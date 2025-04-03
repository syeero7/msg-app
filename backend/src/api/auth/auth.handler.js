import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import prisma from "../../config/prisma-client.js";

export const signupUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);
  await prisma.user.create({
    data: { firstName, lastName, email, password: hashedPassword },
  });

  res.sendStatus(201);
});

export const signinUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ errors: { email: "User not found" } });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ errors: { password: "incorrect password" } });

  const token = jwt.sign({ uid: user.id }, process.env.SECRET);

  res.json({ token, user: { id: user.id, email } });
});
