import { validationResult, body, param } from "express-validator";
import asyncHandler from "express-async-handler";
import prisma from "../lib/prisma-client.js";

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

export const getUserGroupById = [
  param("groupId").toInt().isNumeric(),
  authorizeRequestAs("member"),
  asyncHandler(async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) return res.sendStatus(404);

    const { groupId } = req.params;
    const group = await prisma.group.findUnique({ where: { id: groupId } });
    if (!group) return res.sendStatus(404);

    res.json({ group });
  }),
];

export const getMembersByGroupId = [
  param("groupId").toInt().isNumeric(),
  authorizeRequestAs("creator"),
  asyncHandler(async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) return res.sendStatus(404);

    const { groupId } = req.params;
    const userId = req.user.id;
    const members = await prisma.user.findMany({
      where: {
        NOT: { id: userId },
        groups: {
          some: {
            groupId,
          },
        },
      },
      omit: {
        password: true,
      },
    });

    res.json({ members });
  }),
];

export const getNonMembersByGroupId = [
  param("groupId").toInt().isNumeric(),
  authorizeRequestAs("creator"),
  asyncHandler(async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) return res.sendStatus(404);

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
  }),
];

export const createNewGroup = [
  body("name")
    .isLength({ min: 1, max: 20 })
    .withMessage("Name must be within 20 characters")
    .isAlpha("en-US", { ignore: /\s/ })
    .withMessage("Name must only contain letters"),
  asyncHandler(async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      const formatted = result.formatWith(({ msg }) => msg);
      return res.status(400).json({ errors: formatted.mapped() });
    }

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
  }),
];

export const addMember = [
  param("groupId").toInt().isNumeric(),
  param("memberId").toInt().isNumeric(),
  authorizeRequestAs("creator"),
  asyncHandler(async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) return res.sendStatus(404);

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
  }),
];

export const deleteGroup = [
  param("groupId").toInt().isNumeric(),
  authorizeRequestAs("creator"),
  asyncHandler(async (req, res) => {
    const { groupId } = req.params;
    await prisma.group.delete({
      where: { id: groupId },
    });

    res.sendStatus(204);
  }),
];

export const removeMember = [
  param("groupId").toInt().isNumeric(),
  param("memberId").toInt().isNumeric(),
  authorizeRequestAs("member"),
  asyncHandler(async (req, res) => {
    const { memberId, groupId } = req.params;
    const group = await prisma.group.findUnique({ where: { id: groupId } });
    if (memberId === group.creatorId) return res.sendStatus(400);
    await prisma.userGroup.delete({
      where: {
        userId_groupId: { userId: memberId, groupId },
      },
    });

    res.sendStatus(204);
  }),
];

function authorizeRequestAs(role) {
  return async (req, res, next) => {
    const result = validationResult(req);
    if (!result.isEmpty()) return res.sendStatus(404);

    const { groupId } = req.params;
    const userId = req.user.id;

    switch (role) {
      case "member": {
        const member = await prisma.userGroup.findUnique({
          where: { userId_groupId: { userId, groupId } },
        });
        if (!member) return res.sendStatus(403);

        break;
      }

      case "creator": {
        const group = await prisma.group.findUnique({ where: { id: groupId } });
        if (userId !== group.creatorId) return res.sendStatus(403);

        break;
      }
    }

    next();
  };
}
