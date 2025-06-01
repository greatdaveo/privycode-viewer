import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "./authService";

export interface AuthState {
  user: {
    github_username: string;
    email: string;
  } | null;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  message: string;
}

const initialState: AuthState = {
  user: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
};

export const fetchUserSlice = createAsyncThunk(
  "auth/fetch-user",
  async (_, thunkAPI) => {
    try {
      return await authService.getUser();
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetAuthState: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
    },

    logout: (state) => {
      state.user = null;
      localStorage.removeItem("github_token");
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchUserSlice.pending, (state) => {
        state.isLoading = true;
      })

      .addCase(fetchUserSlice.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })

      .addCase(fetchUserSlice.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
        state.user = null;
      });
  },
});

export const { resetAuthState, logout } = authSlice.actions;
export default authSlice.reducer;
