import asyncHandler from "express-async-handler";
import prisma from "../../config/prisma-client.js";
import { cloudinaryAPI } from "../../utils/Cloudianry.js";

export const getUsers = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const users = await prisma.user.findMany({
    omit: { password: true },
    where: { NOT: { id: userId } },
  });

  res.json({ users });
});

export const getUserById = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    omit: { password: true },
  });

  if (!user) return res.sendStatus(404);
  res.json({ user });
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

export const updateProfileImageUrl = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const filepath = `${userId}/avatar`;

  const url = await cloudinaryAPI.uploadFile(req.file, filepath);
  await prisma.user.update({ where: { id: userId }, data: { imageUrl: url } });

  res.sendStatus(204);
});

export const deleteProfileImageUrl = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const filepath = `${userId}/avatar`;

  await cloudinaryAPI.deleteFile(filepath);
  await prisma.user.update({ where: { id: userId }, data: { imageUrl: null } });

  res.sendStatus(204);
});

export const updateUserProfileAboutMe = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { aboutMe } = req.body;

  await prisma.user.update({ where: { id: userId }, data: { aboutMe } });

  res.sendStatus(204);
});
