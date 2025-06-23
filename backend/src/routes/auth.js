import { Router } from "express";
import * as controllers from "../controllers/auth.js";

const router = Router();

router.use("sign-up", controllers.signUp);
router.use("login", controllers.login);

export default router;
