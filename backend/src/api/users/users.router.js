import { Router } from "express";
import validateRequest from "../../middleware/validate-request.js";
import validateImage from "../../middleware/validate-image.js";
import { userValidator } from "./users.validators.js";
import { upload } from "../../config/multer.js";
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
router.get("/:userId", validateRequest(userValidator), getUserById);

router.put(
  "/:userId/avatar",
  authorize,
  validateImage(upload.single("avatar")),
  validateRequest(userValidator),
  updateProfileImageUrl
);
router.put(
  "/:userId/about",
  authorize,
  validateRequest(userValidator),
  updateUserProfileAboutMe
);

router.delete(
  "/:userId/avatar",
  authorize,
  validateRequest(userValidator),
  deleteProfileImageUrl
);

export default router;

function authorize(req, res, next) {
  if (req.user && req.method === "GET") return next();
  if (Number(req.params.userId) === req.user.id) return next();
  return res.sendStatus(403);
}
