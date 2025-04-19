import axios from "axios";

const API_BASE_URL = "http://localhost:3000/api";

interface UserData {
  id: string;
  name: string;
  email: string;
}

interface AuthResponse {
  user: UserData;
  token?: string;
}

interface SendOtpResponse {
  success: boolean;
  message: string;
}

export const authService = {
  /**
   * Send OTP to user's email for verification
   */
  async sendOtp(email: string): Promise<SendOtpResponse> {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/send-otp`, {
        email,
      });
      return {
        success: true,
        message: response.data.message || "OTP sent successfully",
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message ||
            "Failed to send OTP. Please try again."
        );
      }
      throw new Error("Failed to send OTP. Please try again.");
    }
  },

  /**
   * Verify OTP and complete user registration
   */
  async verifyOtpAndRegister(payload: {
    email: string;
    otp: string;
    name: string;
    password: string;
  }): Promise<AuthResponse> {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/auth/register`,
        payload
      );
      return {
        user: response.data.user,
        token: response.data.token,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message ||
            "Registration failed. Please try again."
        );
      }
      throw new Error("Registration failed. Please try again.");
    }
  },

  /**
   * Login with email and password
   */
  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email,
        password,
      });
      return {
        user: response.data.user,
        token: response.data.token,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message ||
            "Login failed. Please check your credentials."
        );
      }
      throw new Error("Login failed. Please check your credentials.");
    }
  },
};
