import { body, param } from "express-validator";
import prisma from "../../config/prisma-client.js";

export const paramValidator = [
  param("groupId").toInt().isNumeric().withMessage("invalid param type"),
];

export const newGroupValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name must not be empty")
    .isAlpha("en-US", { ignore: /\s/ })
    .withMessage("Name must only contain letters")
    .isLength({ max: 20 })
    .withMessage("Name cannot exceed 20 characters"),
];

export const groupMembersValidator = [
  body("userIds").custom(async (value, { req }) => {
    if (!Array.isArray(value.add) || !Array.isArray(value.remove)) {
      throw new Error("Invalid value");
    }

    const userIds = [...value.add, ...value.remove];
    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true },
    });

    const existingUserIds = new Set(users.map(({ id }) => id));
    const invalidUserIds = userIds.filter((id) => !existingUserIds.has(id));

    if (invalidUserIds.length) {
      throw new Error("userIds contain invalid user ids");
    }

    if (existingUserIds.has(req.user.id)) {
      throw new Error("userIds must not contain creator id");
    }
  }),
];
