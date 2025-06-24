import { validationResult, body, param } from "express-validator";
import asyncHandler from "express-async-handler";
import sharp from "sharp";
import prisma from "../lib/prisma-client.js";
import upload from "../lib/multer.js";
import { uploadFile } from "../lib/cloudinary.js";

export const getDirectMessages = [
  param("userId").toInt().isNumeric(),
  asyncHandler(async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) return res.sendStatus(404);

    const user1 = req.user.id;
    const { userId: user2 } = req.params;
    const messages = await prisma.message.findMany({
      where: {
        type: "DIRECT",
        OR: [
          { senderId: user1, recipientId: user2 },
          { senderId: user2, recipientId: user1 },
        ],
      },
      orderBy: { createdAt: "asc" },
    });

    res.json({ messages });
  }),
];

export const getGroupMessages = [
  param("groupId").toInt().isNumeric(),
  authorizeRequest,
  asyncHandler(async (req, res) => {
    const { groupId } = req.params;
    const messages = await prisma.message.findMany({
      where: {
        type: "GROUP",
        groupId,
      },
      orderBy: { createdAt: "asc" },
    });

    res.json({ messages });
  }),
];

export const createDirectMessageText = [
  param("userId").toInt().isNumeric(),
  body("text")
    .isLength({ min: 1, max: 1000 })
    .withMessage("Message must be within 1000 characters"),
  asyncHandler(async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      const mapped = result.mapped();
      if (mapped["userId"]) return res.sendStatus(404);
      return res.status(400).json({ errors: { text: mapped.text.msg } });
    }

    const user1 = req.user.id;
    const { userId: user2 } = req.params;
    const { text } = req.body;
    await prisma.message.create({
      data: {
        text,
        type: "DIRECT",
        sender: {
          connect: {
            id: user1,
          },
        },
        recipient: {
          connect: {
            id: user2,
          },
        },
      },
    });

    return res.sendStatus(201);
  }),
];

export const createGroupMessageText = [
  param("groupId").toInt().isNumeric(),
  authorizeRequest,
  body("text")
    .isLength({ min: 1, max: 1000 })
    .withMessage("Message must be within 1000 characters"),
  asyncHandler(async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      const formatted = result.formatWith(({ msg }) => msg);
      return res.status(400).json({ errors: formatted.mapped() });
    }

    const userId = req.user.id;
    const { groupId } = req.params;
    const { text } = req.body;
    await prisma.message.create({
      data: {
        text,
        type: "GROUP",
        sender: {
          connect: {
            id: userId,
          },
        },
        group: {
          connect: {
            id: groupId,
          },
        },
      },
    });

    return res.sendStatus(201);
  }),
];

const messageImageValidation = [
  upload.single("image"),
  async (req, res, next) => {
    if (!req.file) return res.status(400).json({ message: "No upload file" });

    const imageTypes = ["image/jpg", "image/jpeg", "image/png"];
    const fileSize = 5; // 5MB
    const imageSize = 2000; // 2000px

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
        .json({ message: `Image must be ${imageSize} x ${imageSize}` });
    }

    next();
  },
];

export const createDirectMessageImage = [
  ...messageImageValidation,
  param("userId").toInt().isNumeric(),
  asyncHandler(async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) return res.sendStatus(404);

    const user1 = req.user.id;
    const { userId: user2 } = req.params;
    const imageUrl = await uploadFile(req.file, `d/${user1}/messages`);
    await prisma.message.create({
      data: {
        imageUrl,
        type: "DIRECT",
        sender: {
          connect: {
            id: user1,
          },
        },
        recipient: {
          connect: {
            id: user2,
          },
        },
      },
    });

    return res.sendStatus(201);
  }),
];

export const createGroupMessageImage = [
  ...messageImageValidation,
  param("groupId").toInt().isNumeric(),
  authorizeRequest,
  asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { groupId } = req.params;
    const imageUrl = await uploadFile(req.file, `g/${groupId}/messages`);
    await prisma.message.create({
      data: {
        imageUrl,
        type: "GROUP",
        sender: {
          connect: {
            id: userId,
          },
        },
        group: {
          connect: {
            id: groupId,
          },
        },
      },
    });

    return res.sendStatus(201);
  }),
];

async function authorizeRequest(req, res, next) {
  const result = validationResult(req);
  if (!result.isEmpty()) return res.sendStatus(404);

  const userId = req.user.id;
  const { groupId } = req.params;
  const member = await prisma.userGroup.findUnique({
    where: { userId_groupId: { userId, groupId } },
  });
  if (!member) return res.sendStatus(403);

  next();
}

// export const createDirectMessage = [
//   param("userId").toInt().isNumeric(),
//   asyncHandler(async (req, res) => {
//     const result = validationResult(req);
//     if (!result.isEmpty()) return res.sendStatus(404);

//     const user1 = req.user.id;
//     const { userId: user2 } = req.params;
//     const data = {
//       type: "DIRECT",
//       sender: { connect: { id: user1 } },
//       recipient: { connect: { id: user2 } },
//     };
//     if (req.file == null) {
//       const { text } = req.body;
//       data.text = text;
//     } else {
//       data.imageUrl = await uploadFile(req.file, `u/${user1}/messages`);
//     }
//     await prisma.message.create({ data });

//     return res.sendStatus(201);
//   }),
// ];

// export const createGroupMessage = [
//   param("groupId").toInt().isNumeric(),
//   authorizeRequest,
//   asyncHandler(async (req, res) => {
//     const userId = req.user.id;
//     const { groupId } = req.params;
//     const data = {
//       type: "GROUP",
//       sender: { connect: { id: userId } },
//       group: { connect: { id: groupId } },
//     };
//     if (req.file == null) {
//       const { text } = req.body;
//       data.text = text;
//     } else {
//       data.imageUrl = await uploadFile(req.file, `g/${groupId}/messages`);
//     }
//     await prisma.message.create({ data });

//     return res.sendStatus(201);
//   }),
// ];
