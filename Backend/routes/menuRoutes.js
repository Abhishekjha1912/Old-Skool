import express from "express";
import {
  addMenuItem,
  getMenuItems,
  deleteMenuItem,
  updateMenuItem,
  getMenuItemById,
} from "../controllers/menuController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.get("/", getMenuItems); // Public
router.get("/:id", getMenuItemById); // Get single item
router.post("/add", protect, adminOnly, upload.single("image"), addMenuItem);
router.put("/:id", protect, adminOnly, upload.single("image"), updateMenuItem);
router.delete("/:id", protect, adminOnly, deleteMenuItem);

export default router;
