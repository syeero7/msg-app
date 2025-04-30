import { Router } from "express";
import prisma from "../../config/prisma-client.js";
import validateRequest from "../../middleware/validate-request.js";
import { newGroupValidator, paramValidator } from "./groups.validators.js";
import {
  getUserGroups,
  getUserGroupById,
  createNewGroup,
  deleteGroup,
  getNonMembersByGroupId,
  addMember,
  removeMember,
  getMembersByGroupId,
} from "./groups.handler.js";

const router = Router();

router.get("/", getUserGroups);
router.get(
  "/:groupId",
  validateRequest(paramValidator),
  authorizeAs("member"),
  getUserGroupById
);
router.get(
  "/:groupId/members",
  validateRequest(paramValidator),
  authorizeAs("creator"),
  getMembersByGroupId
);
router.get(
  "/:groupId/nonmembers",
  validateRequest(paramValidator),
  authorizeAs("creator"),
  getNonMembersByGroupId
);

router.post("/", validateRequest(newGroupValidator), createNewGroup);

router.put(
  "/:groupId/members/:memberId",
  validateRequest(paramValidator),
  authorizeAs("creator"),
  addMember
);

router.delete(
  "/:groupId",
  validateRequest(paramValidator),
  authorizeAs("creator"),
  deleteGroup
);
router.delete(
  "/:groupId/members/:memberId",
  validateRequest(paramValidator),
  authorizeAs("member"),
  removeMember
);

export default router;

function authorizeAs(role) {
  return async (req, res, next) => {
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
