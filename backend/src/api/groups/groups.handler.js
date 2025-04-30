import asyncHandler from "express-async-handler";
import prisma from "../../config/prisma-client.js";

export const getUserGroups = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const groups = await prisma.group.findMany({
    where: {
      members: {
        some: {
          user: { id: userId },
        },
      },
    },
  });

  res.json({ groups });
});

export const getUserGroupById = asyncHandler(async (req, res) => {
  const { groupId } = req.params;
  const group = await prisma.group.findUnique({ where: { id: groupId } });

  res.json({ group });
});

export const getMembersByGroupId = asyncHandler(async (req, res) => {
  const { groupId } = req.params;
  const userId = req.user.id;
  const members = await prisma.userGroup.findMany({
    where: {
      groupId,
      userId: { not: userId },
    },
    select: {
      user: {
        omit: { password: true },
      },
    },
  });

  res.json({ members: members.map(({ user }) => user) });
});

export const getNonMembersByGroupId = asyncHandler(async (req, res) => {
  const { groupId } = req.params;
  const users = await prisma.user.findMany({
    where: {
      NOT: {
        groups: {
          some: {
            groupId,
          },
        },
      },
    },
    omit: { password: true },
  });

  res.json({ users });
});

export const createNewGroup = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { name } = req.body;
  await prisma.group.create({
    data: {
      name,
      creator: {
        connect: {
          id: userId,
        },
      },
      members: {
        create: { userId },
      },
    },
  });

  res.sendStatus(201);
});

export const addMember = asyncHandler(async (req, res) => {
  const { memberId, groupId } = req.params;

  await prisma.group.update({
    where: { id: groupId },
    data: {
      members: {
        create: {
          userId: memberId,
        },
      },
    },
  });

  res.sendStatus(204);
});

export const deleteGroup = asyncHandler(async (req, res) => {
  const { groupId } = req.params;

  await prisma.group.delete({
    where: {
      id: groupId,
    },
  });

  res.sendStatus(204);
});

export const removeMember = asyncHandler(async (req, res) => {
  const { memberId, groupId } = req.params;

  const group = await prisma.group.findUnique({ where: { id: groupId } });
  if (memberId === group.creatorId) return res.sendStatus(400);

  await prisma.userGroup.delete({
    where: {
      userId_groupId: { userId: memberId, groupId },
    },
  });

  res.sendStatus(204);
});
