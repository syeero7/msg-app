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
  const group = await prisma.group.findUnique({
    where: { id: groupId },
    include: {
      members: {
        include: {
          user: {
            omit: {
              password: true,
            },
          },
        },
      },
    },
  });

  res.json({ group });
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

export const updateGroupMembers = asyncHandler(async (req, res) => {
  const { groupId } = req.params;
  const { add: addUserIds, remove: removeUserIds } = req.body.userIds;
  const transactions = [];

  if (addUserIds.length) {
    transactions.push(
      prisma.group.update({
        where: { id: groupId },
        data: {
          members: {
            createMany: { data: addUserIds.map((userId) => ({ userId })) },
          },
        },
      })
    );
  }

  if (removeUserIds.length) {
    transactions.push(
      prisma.userGroup.deleteMany({
        where: {
          groupId,
          userId: {
            in: removeUserIds,
          },
        },
      })
    );
  }

  await prisma.$transaction(transactions);

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
