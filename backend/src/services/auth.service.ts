import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import { sendEmail } from "../lib/email";
import { generateOTP } from "../utils/otp";
import logger from "../lib/logger";
import { RedisClient } from "../config/redis";

const prisma = new PrismaClient();
const redis = RedisClient.getInstance();

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const OTP_EXPIRY_MINUTES = parseInt(process.env.OTP_EXPIRY_MINUTES || "15");
const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS || "10");
const TEMP_DATA_EXPIRY = OTP_EXPIRY_MINUTES * 60;

class AuthService {
  /**
   * Generate and send OTP to user's email
   */
  async sendOtp(
    email: string,
    name?: string,
    password?: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      if (!this.validateEmail(email)) {
        throw new Error("Invalid email format");
      }

      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        throw new Error("User already exists");
      }

      const otp = generateOTP();
      const otpKey = `otp:${email}`;

      // Store temporary registration data if provided
      if (name && password) {
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        const tempData = { name, password: hashedPassword };
        await redis.setex(
          `reg:${email}`,
          TEMP_DATA_EXPIRY,
          JSON.stringify(tempData)
        );
      }

      await redis.setex(otpKey, TEMP_DATA_EXPIRY, otp);

      await sendEmail({
        to: email,
        subject: "Your Verification OTP",
        text: `Your OTP is: ${otp}. It will expire in ${OTP_EXPIRY_MINUTES} minutes.`,
        html: `<p>Your OTP is: <strong>${otp}</strong>. It will expire in ${OTP_EXPIRY_MINUTES} minutes.</p>`,
      });

      logger.info(`OTP sent to ${email}`);
      return { success: true, message: "OTP sent successfully" };
    } catch (error) {
      logger.error(`Error sending OTP to ${email}:`, error);
      throw error;
    }
  }

  /**
   * Verify OTP and register user
   */
  async verifyOtpAndRegister(payload: {
    email: string;
    otp: string;
  }): Promise<{ user: any; token: string }> {
    try {
      const { email, otp } = payload;

      // Verify OTP first
      const storedOtp = await redis.get(`otp:${email}`);
      if (!storedOtp || storedOtp !== otp) {
        throw new Error("Invalid or expired OTP");
      }

      // Get registration data from Redis
      const regData = await redis.get(`reg:${email}`);
      if (!regData) {
        throw new Error("Registration session expired. Please start again.");
      }

      const { name, password } = JSON.parse(regData);

      // Create user
      const user = await prisma.user.create({
        data: {
          id: uuidv4(),
          email,
          name,
          password,
          role: "CUSTOMER",
          status: "ACTIVE",
        },
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      // Generate token and cleanup
      const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      await this.cleanupSession(email);

      logger.info(`User registered: ${email}`);
      return { user, token };
    } catch (error) {
      logger.error("Registration error:", { error, payload });
      throw error;
    }
  }
  private async cleanupSession(email: string): Promise<void> {
    await Promise.all([redis.del(`otp:${email}`), redis.del(`reg:${email}`)]);
  }

  /**
   * Login with email and password
   */
  async login(
    email: string,
    password: string
  ): Promise<{ user: any; token: string }> {
    try {
      // Validate inputs
      if (!email || !password) {
        throw new Error("Email and password are required");
      }

      // Find user
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        throw new Error("Invalid credentials");
      }

      // Verify password
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        throw new Error("Invalid credentials");
      }

      // Generate JWT token
      const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
        expiresIn: "7d",
      });

      // Update last login
      await prisma.user.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() },
      });

      logger.info(`User logged in: ${email}`);

      return {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
        token,
      };
    } catch (error) {
      logger.error(`Login error for ${email}:`, error);
      throw error;
    }
  }

  /**
   * Helper function to validate email format
   */
  private validateEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }
}

export default new AuthService();
