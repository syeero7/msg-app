import { Router } from "express";
import prisma from "../../config/prisma-client.js";
import validateRequest from "../../middleware/validate-request.js";
import {
  groupMembersValidator,
  newGroupValidator,
  paramValidator,
} from "./groups.validators.js";
import {
  getUserGroups,
  getUserGroupById,
  createNewGroup,
  updateGroupMembers,
  deleteGroup,
} from "./groups.handler.js";

const router = Router();

router.get("/", getUserGroups);
router.get("/:groupId", validateRequest(paramValidator), authorize, getUserGroupById);

router.post("/", validateRequest(newGroupValidator), createNewGroup);

router.put(
  "/:groupId/members",
  validateRequest(paramValidator),
  authorize,
  validateRequest(groupMembersValidator),
  updateGroupMembers
);

router.delete("/:groupId", validateRequest(paramValidator), authorize, deleteGroup);

export default router;

async function authorize(req, res, next) {
  const { groupId } = req.params;
  const userId = req.user.id;

  switch (req.method) {
    case "GET":
      {
        const member = await prisma.userGroup.findUnique({
          where: { userId_groupId: { userId, groupId } },
        });
        if (!member) return res.sendStatus(403);
      }

      break;

    default:
      {
        const group = await prisma.group.findUnique({ where: { id: groupId } });
        if (userId !== group.creatorId) return res.sendStatus(403);
      }

      break;
  }

  next();
}
