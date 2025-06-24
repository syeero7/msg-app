import { Router } from "express";
import * as controllers from "../controllers/messages.js";

const router = Router();

router.get("/direct/:userId", controllers.getDirectMessages);
router.post("/direct/:userId/text", controllers.createDirectMessageText);
router.post("/direct/:userId/image", controllers.createDirectMessageImage);

router.get("/group/:groupId", controllers.getGroupMessages);
router.post("/group/:groupId/text", controllers.createGroupMessageText);
router.post("/group/:groupId/image", controllers.createGroupMessageImage);

export default router;
