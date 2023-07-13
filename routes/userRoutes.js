import express from "express";
import { protect } from "./../controllers/authController.js";
import { googlelogin, getMe } from "./../controllers/authController.js";
import {
  getCredits,
  decreaseCredits,
} from "./../controllers/userController.js";
const router = express.Router();

router.post("/login", googlelogin);
router.post("/me", protect, getMe);
router.get("/credits", protect, getCredits);
router.patch("/credits", protect, decreaseCredits);
export default router;
