/* eslint-disable @typescript-eslint/no-explicit-any */
import { staff_API } from "@/lib/utils/axios.config";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  authorize,
  isEmailRegistered,
  checkEmailExists,
  generateOTP,
  encryptData,
  decryptData,
} from "@/lib/utils/auth.utils";
import {
  Auth,
  RegisterPayload,
  PasswordResetState,
  UpdatePasswordPayload,
} from "@/lib/schemas/staff.schema";
import { setItemWithExpiry } from "@/lib/utils/storage.utils";

const initialPasswordResetState: PasswordResetState = {
  message: "",
  status: "",
  loading: false,
};

export const login = createAsyncThunk<string, Auth, { rejectValue: string }>(
  "auth/login",
  async (formData, { fulfillWithValue, rejectWithValue }) => {
    try {
      const res = await staff_API.get("/resource/staff");
      const user = authorize(formData, res.data.data);

      if (user) {
        // Encrypt and save user data with expiration
        const userData = {
          id: user.id,
          name: user.name,
          department: user.department,
          rank: user.rank,
          role: user.role,
          email: user.email,
        };

        const userDataEncrypted = encryptData(JSON.stringify(userData));
        setItemWithExpiry("userData", userDataEncrypted, 3 * 60 * 60 * 1000); // 3 hours expiry
        return fulfillWithValue(`Welcome ${user.name}!`);
      } else {
        return rejectWithValue("Invalid email or password");
      }
    } catch (error) {
      console.error("Error during login:", error);
      return rejectWithValue("Login failed due to server error");
    }
  }
);

export const register = createAsyncThunk<
  string,
  RegisterPayload,
  { rejectValue: string }
>("auth/register", async (formData, { fulfillWithValue, rejectWithValue }) => {
  try {
    const emailExists = await isEmailRegistered(formData.email);
    if (emailExists) {
      return rejectWithValue("Email is already registered");
    }

    await staff_API.post("/resource/pendingStaff", formData);
    return fulfillWithValue("Register successful");
  } catch (error) {
    return rejectWithValue("Error registering");
  }
});

export const requestPasswordReset = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>(
  "passwordReset/request",
  async (email, { fulfillWithValue, rejectWithValue }) => {
    try {
      const { exists, id, role, active, name, department, rank } =
        await checkEmailExists(email);
      if (!exists || !id) {
        return rejectWithValue("Email not found. Please try again.");
      }
      // Generate OTP and log it (simulating sending OTP email)
      const otp = generateOTP();
      localStorage.setItem("resetEmail", encryptData(email));
      localStorage.setItem("resetId", encryptData(id));
      localStorage.setItem("otp", encryptData(otp));
      localStorage.setItem("role", encryptData(role || ""));
      localStorage.setItem("active", encryptData(active ? "true" : "false"));
      localStorage.setItem("name", encryptData(name || ""));
      localStorage.setItem("department", encryptData(department || ""));
      localStorage.setItem("rank", encryptData(rank || ""));
      return fulfillWithValue("OTP has been sent to your email.");
    } catch (error) {
      return rejectWithValue("Error sending OTP. Please try again.");
    }
  }
);

export const updatePassword = createAsyncThunk<
  string,
  UpdatePasswordPayload,
  { rejectValue: string }
>(
  "auth/updatePassword",
  async (formData, { fulfillWithValue, rejectWithValue }) => {
    try {
      const id = decryptData(localStorage.getItem("resetId") || "");
      if (!id) {
        return rejectWithValue("User not found");
      }
      const response = await staff_API.put(`/resource/staff/${id}`, formData);
      if (response.status === 200) {
        localStorage.removeItem("active");
        localStorage.removeItem("role");
        localStorage.removeItem("otp");
        localStorage.removeItem("resetEmail");
        localStorage.removeItem("name");
        localStorage.removeItem("department");
        localStorage.removeItem("resetId");
        localStorage.removeItem("rank");
        return fulfillWithValue("Password updated successfully.");
      } else {
        return rejectWithValue("Error updating password.");
      }
    } catch (error) {
      return rejectWithValue("Error updating password.");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    error: "",
    message: "",
    isLoading: false,
    isAuthenticated: false,
    passwordReset: initialPasswordResetState,
  },
  reducers: {
    clearMessages: (state) => {
      state.error = "";
      state.message = "";
    },
    resetPasswordResetMessage: (state) => {
      state.passwordReset.message = "";
      state.passwordReset.status = "";
    },
  },
  extraReducers: (builder) => {
    builder
      // LOGIN
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        login.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.isLoading = false;
          state.error = action.payload || "Error logging in";
          state.isAuthenticated = false;
        }
      )
      .addCase(login.fulfilled, (state, action: PayloadAction<string>) => {
        state.isLoading = false;
        state.message = action.payload;
        state.isAuthenticated = true;
      })
      // REGISTER
      .addCase(register.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        register.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.isLoading = false;
          state.error = action.payload || "Error registering";
        }
      )
      .addCase(register.fulfilled, (state, action: PayloadAction<string>) => {
        state.isLoading = false;
        state.message = action.payload;
      })
      // PASSWORD RESET
      .addCase(requestPasswordReset.pending, (state) => {
        state.passwordReset.loading = true;
        state.passwordReset.message = "";
        state.passwordReset.status = "";
      })
      .addCase(
        requestPasswordReset.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.passwordReset.loading = false;
          state.passwordReset.message =
            action.payload || "Error sending OTP. Please try again.";
          state.passwordReset.status = "error";
        }
      )
      .addCase(
        requestPasswordReset.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.passwordReset.loading = false;
          state.passwordReset.message = action.payload;
          state.passwordReset.status = "success";
        }
      )
      // UPDATE PASSWORD
      .addCase(updatePassword.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        updatePassword.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.isLoading = false;
          state.error = action.payload || "Error updating password.";
        }
      )
      .addCase(
        updatePassword.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.isLoading = false;
          state.message = action.payload;
        }
      );
  },
});

export const { clearMessages, resetPasswordResetMessage } = authSlice.actions;
export default authSlice.reducer;
