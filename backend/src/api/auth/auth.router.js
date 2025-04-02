import { Router } from "express";
import validateRequest from "../../middleware/validate-request.js";
import { userValidator } from "./auth.validators.js";
import { signupUser, signinUser } from "./auth.handler.js";

const router = Router();

router.post("/signin", signinUser);
router.post("/signup", validateRequest(userValidator), signupUser);

export default router;
