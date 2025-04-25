import { Request, Response } from "express";
import authService from "../services/auth.service";
import logger from "../lib/logger";
import { validate } from "../middlewares/validation.middleware";
import {
  sendOtpSchema,
  verifyOtpSchema,
  loginSchema,
} from "../validations/auth.validation";

class AuthController {
  // Apply validation middleware to the sendOtp method
  sendOtp = [
    validate(sendOtpSchema),
    async (req: Request, res: Response): Promise<void> => {
      try {
        const { email, name, password } = req.body;
        const result = await authService.sendOtp(email, name, password);
        res.status(200).json(result);
      } catch (error: any) {
        logger.error("Send OTP error:", error);
        res.status(400).json({
          error: error.message,
          code: error.code || "OTP_SEND_FAILED",
        });
      }
    },
  ];

  // Apply validation middleware to the verifyOtpAndRegister method
  verifyOtpAndRegister = [
    validate(verifyOtpSchema),
    async (req: Request, res: Response): Promise<void> => {
      try {
        const { email, otp } = req.body;
        const result = await authService.verifyOtpAndRegister({ email, otp });
        res.status(201).json(result);
      } catch (error: any) {
        logger.error("Registration error:", error);
        res.status(400).json({
          error: error.message,
          code: error.code || "REGISTRATION_FAILED",
        });
      }
    },
  ];

  // Apply validation middleware to the login method
  login = [
    validate(loginSchema),
    async (req: Request, res: Response): Promise<void> => {
      try {
        const { email, password } = req.body;
        const result = await authService.login(email, password);
        res.status(200).json(result);
      } catch (error: any) {
        logger.error("Login error:", error);
        res.status(401).json({
          error: error.message,
          code: error.code || "LOGIN_FAILED",
        });
      }
    },
  ];
}

export default new AuthController();
