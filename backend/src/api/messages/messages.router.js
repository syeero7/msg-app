import { Router } from "express";
import prisma from "../../config/prisma-client.js";
import validateRequest from "../../middleware/validate-request.js";
import {
  validateImage,
  messageValidator,
  paramsValidator,
} from "./messages.validators.js";
import {
  getDirectMessages,
  getGroupMessages,
  createDirectMessage,
  createGroupMessage,
} from "./messages.handler.js";

const router = Router();

router.get("/direct/:userId", validateRequest(paramsValidator), getDirectMessages);

router.post(
  "/direct/:userId/text",
  validateRequest(paramsValidator),
  validateRequest(messageValidator),
  createDirectMessage
);
router.post(
  "/direct/:userId/image",
  validateRequest(paramsValidator),
  validateImage,
  createDirectMessage
);

router.get(
  "/group/:groupId",
  validateRequest(paramsValidator),
  authorize,
  getGroupMessages
);

router.post(
  "/group/:groupId/text",
  validateRequest(paramsValidator),
  authorize,
  validateRequest(messageValidator),
  createGroupMessage
);
router.post(
  "/group/:groupId/image",
  validateRequest(paramsValidator),
  authorize,
  validateImage,
  createGroupMessage
);

export default router;

async function authorize(req, res, next) {
  const userId = req.user.id;
  const { groupId } = req.params;

  const member = await prisma.userGroup.findUnique({
    where: { userId_groupId: { userId, groupId } },
  });
  if (!member) return res.sendStatus(403);

  next();
}
