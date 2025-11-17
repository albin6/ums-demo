import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { userApi, adminApi } from '../services/api';
import { IUser } from '../types/User';

export interface AuthState {
  user: IUser | null;
  token: string | null;
  admin: IUser | null;
  adminToken: string | null;
  isAuthenticated: boolean;
  isAdminAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  admin: null,
  adminToken: localStorage.getItem('adminToken'),
  isAuthenticated: !!localStorage.getItem('token'),
  isAdminAuthenticated: !!localStorage.getItem('adminToken'),
  loading: false,
  error: null,
};

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await userApi.login({ email, password });
      const { token, user } = response.data;

      localStorage.setItem('token', token);

      return { token, user: user };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Login failed'
      );
    }
  }
);

export const loginAdmin = createAsyncThunk(
  'auth/loginAdmin',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await adminApi.login({ email, password });
      const { token, user } = response.data;

      localStorage.setItem('adminToken', token);

      return { token, user: user };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Admin login failed'
      );
    }
  }
);

export const signupUser = createAsyncThunk(
  'auth/signupUser',
  async ({ name, email, password }: { name: string; email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await userApi.signup({ name, email, password });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Signup failed'
      );
    }
  }
);

export const fetchUserProfile = createAsyncThunk(
  'auth/fetchUserProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await userApi.getProfile();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch profile'
      );
    }
  }
);

export const createUserByAdmin = createAsyncThunk(
  'auth/createUserByAdmin',
  async ({ name, email, password }: { name: string; email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await adminApi.createUser({ name, email, password });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create user'
      );
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logoutUser: (state) => {
      localStorage.removeItem('token');
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
    logoutAdmin: (state) => {
      localStorage.removeItem('adminToken');
      state.admin = null;
      state.adminToken = null;
      state.isAdminAuthenticated = false;
    },
    clearError: (state) => {
      state.error = null;
    },
    setAuthFromStorage: (state) => {
      const token = localStorage.getItem('token');
      const adminToken = localStorage.getItem('adminToken');

      if (token) {
        state.token = token;
        state.isAuthenticated = true;
      }

      if (adminToken) {
        state.adminToken = adminToken;
        state.isAdminAuthenticated = true;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<{ token: string; user: { id: string; name: string; email: string } }>) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = {
          _id: action.payload.user.id,
          name: action.payload.user.name,
          email: action.payload.user.email,
          isBlocked: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          profileImage: undefined,
        };
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(loginAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAdmin.fulfilled, (state, action: PayloadAction<{ token: string; user: { id: string; name: string; email: string } }>) => {
        state.loading = false;
        state.adminToken = action.payload.token;
        state.admin = {
          _id: action.payload.user.id,
          name: action.payload.user.name,
          email: action.payload.user.email,
          isBlocked: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          profileImage: undefined,
        };
        state.isAdminAuthenticated = true;
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action: PayloadAction<IUser>) => {
        state.user = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(createUserByAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUserByAdmin.fulfilled, (state, action: PayloadAction<IUser>) => {
        state.loading = false;
      })
      .addCase(createUserByAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logoutUser, logoutAdmin, clearError, setAuthFromStorage } = authSlice.actions;
export default authSlice.reducer;