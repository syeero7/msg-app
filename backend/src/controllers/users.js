import { validationResult, body, param } from "express-validator";
import asyncHandler from "express-async-handler";
import sharp from "sharp";
import prisma from "../lib/prisma-client.js";
import { uploadFile, deleteFile } from "../lib/cloudinary.js";
import upload from "../lib/multer.js";

export const getUsers = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const users = await prisma.user.findMany({
    omit: { password: true },
    where: { NOT: { id: userId } },
  });

  res.json({ users });
});

export const getOnlineUsers = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
  const users = await prisma.user.findMany({
    where: {
      lastActiveAt: { gte: oneMinuteAgo },
      NOT: { id: userId },
    },
    omit: { password: true },
  });

  res.json({ users });
});

export const getUserById = [
  param("userId").toInt().isNumeric(),
  asyncHandler(async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) return res.sendStatus(404);

    const { userId } = req.params;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      omit: { password: true },
    });

    if (!user) return res.sendStatus(404);
    res.json({ user });
  }),
];

export const updateProfileImageUrl = [
  upload.single("avatar"),
  asyncHandler(async (req, res) => {
    if (!req.file) return res.status(400).json({ message: "No upload file" });

    const imageTypes = ["image/jpg", "image/jpeg", "image/png"];
    const fileSize = 3; // 3MB
    const imageSize = 300; // 300px

    const { mimetype, size, buffer } = req.file;

    if (!imageTypes.includes(mimetype)) {
      return res
        .status(400)
        .json({ message: "File format must be either JPEG or PNG" });
    }

    if (size / (1024 * 1024) > fileSize) {
      return res.status(400).json({
        message: `File size exceeds the maximum limit of ${fileSize}MB`,
      });
    }

    const { height, width } = await sharp(buffer).metadata();
    if (height !== imageSize || width !== imageSize) {
      return res
        .status(400)
        .json({ message: `Avatar must be ${imageSize} x ${imageSize}` });
    }

    const userId = req.user.id;
    const url = await uploadFile(req.file, `${userId}/avatar`);
    await prisma.user.update({
      where: { id: userId },
      data: { imageUrl: url },
    });

    res.sendStatus(204);
  }),
];

export const deleteProfileImageUrl = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  await deleteFile(`${userId}/avatar`);
  await prisma.user.update({
    where: { id: userId },
    data: { imageUrl: null },
  });

  res.sendStatus(204);
});

export const updateUserProfileAboutMe = [
  body("aboutMe")
    .isLength({ max: 200 })
    .withMessage("About Me cannot exceed 200 characters"),
  asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { aboutMe } = req.body;
    await prisma.user.update({
      where: { id: userId },
      data: { aboutMe },
    });

    res.sendStatus(204);
  }),
];
