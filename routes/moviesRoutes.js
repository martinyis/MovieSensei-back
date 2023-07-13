import express from "express";
import { protect } from "../controllers/authController.js";
import { movieGenerator } from "./../controllers/movieController.js";
import { validate } from "../controllers/middleController.js";
const router = express.Router();

router.post("/generateMovie/:option", protect, validate, movieGenerator);
export default router;
