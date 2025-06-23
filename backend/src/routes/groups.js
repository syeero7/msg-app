import { Router } from "express";
import * as controllers from "../controllers/groups.js";

const router = Router();

router.get("/", controllers.getUserGroups);
router.post("/", controllers.createNewGroup);

// member routes
router.get("/:groupId", controllers.getUserGroupById);

// creator routes
router.get("/:groupId/members", controllers.getMembersByGroupId);
router.get("/:groupId/nonmembers", controllers.getNonMembersByGroupId);
router.put("/:groupId/members/:memberId", controllers.addMember);
router.delete("/:groupId", controllers.deleteGroup);
router.delete("/:groupId/members/:memberId", controllers.removeMember);

export default router;
