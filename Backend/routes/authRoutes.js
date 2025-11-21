import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

import { protect } from "../middleware/authMiddleware.js";
import { getCurrentUser } from "../controllers/authController.js";

// Return current user data (requires valid token)
router.get("/me", protect, getCurrentUser);

export default router;
