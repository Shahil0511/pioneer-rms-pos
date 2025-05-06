import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { authService } from "../../services/authService";

export interface AuthState {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  } | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  activeAuthForm: "login" | "signup" | "verify-email";
  showAuthModal: boolean;
  formData: {
    email: string;
    password: string;
    name: string;
  };
  otpCountdown: number;
  role: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  activeAuthForm: "login",
  showAuthModal: false,
  formData: {
    email: "",
    password: "",
    name: "",
  },
  otpCountdown: 0,
  role: null,
};

// Async thunks for authentication operations
export const loginUser = createAsyncThunk(
  "auth/login",
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await authService.login(email, password);
      return response;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

export const sendOtp = createAsyncThunk(
  "auth/sendOtp",
  async (
    {
      email,
      name,
      password,
    }: { email: string; name: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await authService.sendOtp(email, name, password);
      return response;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

export const verifyOtpAndRegister = createAsyncThunk(
  "auth/verifyOtp",
  async (
    { email, otp }: { email: string; otp: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await authService.verifyOtpAndRegister({ email, otp });
      return response;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.role = null;
      localStorage.removeItem("authToken");
      localStorage.removeItem("userRole");
    },
    setActiveAuthForm: (
      state,
      action: PayloadAction<"login" | "signup" | "verify-email">
    ) => {
      state.activeAuthForm = action.payload;
    },
    toggleAuthModal: (state, action: PayloadAction<boolean>) => {
      state.showAuthModal = action.payload;
    },
    updateFormData: (
      state,
      action: PayloadAction<{ field: string; value: string }>
    ) => {
      const { field, value } = action.payload;
      state.formData = {
        ...state.formData,
        [field]: value,
      };
    },
    setFormData: (
      state,
      action: PayloadAction<{ email: string; password: string; name: string }>
    ) => {
      state.formData = action.payload;
    },
    syncAuthState: (
      state,
      action: PayloadAction<{ token: string; role: string }>
    ) => {
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.role = action.payload.role;
      state.user = {
        id: "",
        name: "",
        email: "",
        role: action.payload.role,
      };
    },
    decrementOtpCountdown: (state) => {
      if (state.otpCountdown > 0) {
        state.otpCountdown -= 1;
      }
    },
    setOtpCountdown: (state, action: PayloadAction<number>) => {
      state.otpCountdown = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder.addCase(loginUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token || null;
      state.isAuthenticated = true;
      state.role = action.payload.user?.role || null;
      if (action.payload.token) {
        localStorage.setItem("authToken", action.payload.token);
      }
      if (action.payload.role) {
        localStorage.setItem("userRole", action.payload.role);
      }
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Send OTP
    builder.addCase(sendOtp.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(sendOtp.fulfilled, (state) => {
      state.loading = false;
      state.activeAuthForm = "verify-email";
      state.otpCountdown = 60;
    });
    builder.addCase(sendOtp.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Verify OTP
    builder.addCase(verifyOtpAndRegister.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(verifyOtpAndRegister.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token || null;
      state.isAuthenticated = true;
      state.showAuthModal = false;
      state.role = action.payload.user?.role || null;
      if (action.payload.token) {
        localStorage.setItem("authToken", action.payload.token);
      }
      if (action.payload.role) {
        localStorage.setItem("userRole", action.payload.role);
      }
    });
    builder.addCase(verifyOtpAndRegister.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const {
  logout,
  setActiveAuthForm,
  toggleAuthModal,
  updateFormData,
  setFormData,
  decrementOtpCountdown,
  setOtpCountdown,
  clearError,
} = authSlice.actions;

export default authSlice.reducer;
