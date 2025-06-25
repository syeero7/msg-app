import { Router } from "express";
import * as controllers from "../controllers/users.js";

const router = Router();

router.get("/", controllers.getUsers);
router.get("/online", controllers.getOnlineUsers);
router.get("/:userId", controllers.getUserById);
router.put("/avatar", controllers.updateProfileImageUrl);
router.put("/about", controllers.updateUserProfileAboutMe);
router.delete("/avatar", controllers.deleteProfileImageUrl);

export default router;
