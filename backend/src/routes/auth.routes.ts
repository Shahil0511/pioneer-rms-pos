import { Router } from "express";
import AuthController from "../controllers/auth.controller";
import { validate } from "../middlewares/validation.middleware";
import {
  sendOtpSchema,
  verifyOtpSchema,
  loginSchema,
} from "../validations/auth.validation";
import rateLimit from "express-rate-limit";

// Rate limiting for auth endpoints
const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 20 requests per windowMs
  message: "Too many requests from this IP, please try again later",
  standardHeaders: true,
  legacyHeaders: false,
});

const router = Router();

// Apply rate limiting to all auth routes
router.use(authRateLimiter);

router.post("/auth/send-otp", validate(sendOtpSchema), AuthController.sendOtp);

router.post(
  "/auth/register",
  validate(verifyOtpSchema),
  AuthController.verifyOtpAndRegister
);

router.post("/auth/login", validate(loginSchema), AuthController.login);

// Add a health check endpoint for auth service
router.get("/auth/health", (_, res) => {
  res.status(200).json({ status: "OK", message: "Auth service is healthy" });
});

export default router;
