import { createMenu } from "../controllers/menu.controller";
import { Router } from "express";
import rateLimit from "express-rate-limit";

const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: "Too many requests from this IP, please try again later",
  standardHeaders: true,
  legacyHeaders: false,
});

const router = Router();

router.use(authRateLimiter);

router.post("/menu/add", createMenu);

export default router;
