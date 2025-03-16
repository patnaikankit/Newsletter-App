import { Router } from "express";
import { isAuthenticated } from "../middlewares/auth.middleware";
import { registerAuthor, loginAuthor, logoutAuthor, isLoggedIn  } from "../controllers/auth.controller";

const router = Router();


router.post("/register", registerAuthor);
router.post("/login", loginAuthor);

router.post("/logout", logoutAuthor);
router.post("/is-logged-in", isAuthenticated, isLoggedIn);

export default router;
