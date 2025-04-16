import { Router } from "express";
import validateRequest from "../../middleware/validate-request.js";
import {
  userDetailsValidator,
  paramsValidator,
  validateAvatar,
} from "./users.validators.js";
import {
  getUsers,
  getUserById,
  updateProfileImageUrl,
  deleteProfileImageUrl,
  updateUserProfileAboutMe,
  getOnlineUsers,
} from "./users.handler.js";

const router = Router();

router.get("/", getUsers);
router.get("/online", getOnlineUsers);
router.get("/:userId", validateRequest(paramsValidator), getUserById);

router.put("/avatar", validateAvatar, updateProfileImageUrl);
router.put("/about", validateRequest(userDetailsValidator), updateUserProfileAboutMe);

router.delete("/avatar", deleteProfileImageUrl);

export default router;
