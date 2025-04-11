import asyncHandler from "express-async-handler";
import prisma from "../../config/prisma-client.js";
import { cloudinaryAPI } from "../../utils/Cloudianry.js";

export const getDirectMessages = asyncHandler(async (req, res) => {
  const user1Id = req.user.id;
  const { userId: user2Id } = req.params;

  const messages = await prisma.message.findMany({
    where: {
      type: "DIRECT",
      OR: [
        { senderId: user1Id, recipientId: user2Id },
        { senderId: user2Id, recipientId: user1Id },
      ],
    },
    orderBy: { createdAt: "asc" },
  });

  res.json({ messages });
});

export const getGroupMessages = asyncHandler(async (req, res) => {
  const { groupId } = req.params;

  const messages = await prisma.message.findMany({
    where: {
      type: "GROUP",
      groupId,
    },
    orderBy: { createdAt: "asc" },
  });

  res.json({ messages });
});

export const createDirectMessage = asyncHandler(async (req, res) => {
  const user1Id = req.user.id;
  const { userId: user2Id } = req.params;

  const data = {
    type: "DIRECT",
    sender: { connect: { id: user1Id } },
    recipient: { connect: { id: user2Id } },
  };

  const isText = req.file == null;
  if (isText) {
    const { text } = req.body;
    data.text = text;
  } else {
    const filepath = `${user1Id}/messages`;
    const url = await cloudinaryAPI.uploadFile(req.file, filepath);
    data.imageUrl = url;
  }

  await prisma.message.create({ data });

  return res.sendStatus(201);
});

export const createGroupMessage = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { groupId } = req.params;

  const data = {
    type: "GROUP",
    sender: { connect: { id: userId } },
    group: { connect: { id: groupId } },
  };

  const isText = req.file == null;
  if (isText) {
    const { text } = req.body;
    data.text = text;
  } else {
    const filepath = `${userId}/messages`;
    const url = await cloudinaryAPI.uploadFile(req.file, filepath);
    data.imageUrl = url;
  }

  await prisma.message.create({ data });

  return res.sendStatus(201);
});
