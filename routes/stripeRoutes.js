import express from "express";
import stripe from "stripe";
import dotenv from "dotenv";
import app from "../app.js";
import { protect } from "./../controllers/authController.js";
import { createSession, webHook } from "../controllers/stripeController.js";
const router = express.Router();
router.post("/webhook", express.raw({ type: "application/json" }), webHook);
router.use(express.json());
router.post("/create-checkout-session", protect, createSession);

export default router;
