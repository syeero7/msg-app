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

router.put(
  "/:userId/avatar",
  validateRequest(paramsValidator),
  authorize,
  validateAvatar,
  updateProfileImageUrl
);
router.put(
  "/:userId/about",
  validateRequest(paramsValidator),
  authorize,
  validateRequest(userDetailsValidator),
  updateUserProfileAboutMe
);

router.delete(
  "/:userId/avatar",
  validateRequest(paramsValidator),
  authorize,
  deleteProfileImageUrl
);

export default router;

function authorize(req, res, next) {
  if (req.user && req.method === "GET") return next();
  if (req.params.userId === req.user.id) return next();
  return res.sendStatus(403);
}
