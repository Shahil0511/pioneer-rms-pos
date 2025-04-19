import { Request, Response } from "express";
import authService from "../services/auth.service";
import logger from "../lib/logger";

class AuthController {
  async sendOtp(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;
      const result = await authService.sendOtp(email);
      res.status(200).json(result);
    } catch (error: any) {
      logger.error("Error in sendOtp:", error);
      res.status(400).json({ error: error.message });
    }
  }

  async verifyOtpAndRegister(req: Request, res: Response): Promise<void> {
    try {
      const { email, otp, name, password } = req.body;
      const result = await authService.verifyOtpAndRegister({
        email,
        otp,
        name,
        password,
      });
      res.status(201).json(result);
    } catch (error: any) {
      logger.error("Error in verifyOtpAndRegister:", error);
      res.status(400).json({ error: error.message });
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      res.status(200).json(result);
    } catch (error: any) {
      logger.error("Error in login:", error);
      res.status(400).json({ error: error.message });
    }
  }
}

export default new AuthController();
