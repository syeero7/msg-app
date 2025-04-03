import { Router } from "express";
import validateRequest from "../../middleware/validate-request.js";
import { authValidator } from "./auth.validators.js";
import { signupUser, signinUser } from "./auth.handler.js";

const router = Router();

router.post("/signin", signinUser);
router.post("/signup", validateRequest(authValidator), signupUser);

export default router;
