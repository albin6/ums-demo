import axios, { AxiosResponse } from "axios";
import { IUser, ILoginResponse, IPaginatedResponse } from "../types/User";

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    const adminToken = localStorage.getItem("adminToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else if (adminToken) {
      config.headers.Authorization = `Bearer ${adminToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Clear tokens if unauthorized
      localStorage.removeItem("token");
      localStorage.removeItem("adminToken");
      window.location.href = "/"; // Redirect to home
    }
    return Promise.reject(error);
  }
);

export const userApi = {
  // User authentication
  signup: (userData: {
    name: string;
    email: string;
    password: string;
  }): Promise<AxiosResponse<IUser>> => {
    return apiClient.post("/users/signup", userData);
  },

  login: (credentials: {
    email: string;
    password: string;
  }): Promise<AxiosResponse<ILoginResponse>> => {
    return apiClient.post("/users/login", credentials);
  },

  logout: (): Promise<void> => {
    localStorage.removeItem("token");
    return Promise.resolve();
  },

  // User profile
  getProfile: (): Promise<AxiosResponse<IUser>> => {
    return apiClient.get("/users/profile");
  },

  updateProfile: (userData: Partial<IUser>): Promise<AxiosResponse<IUser>> => {
    return apiClient.put("/users/profile", userData);
  },
  
  // Profile image upload
  uploadProfileImage: (file: File): Promise<AxiosResponse<any>> => {
    const formData = new FormData();
    formData.append('profileImage', file);
    
    return apiClient.post("/users/upload", formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

export const adminApi = {
  // Admin authentication
  login: (credentials: {
    email: string;
    password: string;
  }): Promise<AxiosResponse<ILoginResponse>> => {
    return apiClient.post("/admin/login", credentials);
  },

  logout: (): Promise<void> => {
    localStorage.removeItem("adminToken");
    return Promise.resolve();
  },

  // User management
  getUsers: (
    page: number,
    limit: number,
    search?: string
  ): Promise<AxiosResponse<IPaginatedResponse<IUser>>> => {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("limit", limit.toString());

    if (search) {
      params.append("search", search);
    }

    return apiClient.get(`/admin/users?${params.toString()}`);
  },

  blockUser: (userId: string): Promise<AxiosResponse<IUser>> => {
    return apiClient.patch(`/admin/users/${userId}/block`);
  },

  unblockUser: (userId: string): Promise<AxiosResponse<IUser>> => {
    return apiClient.patch(`/admin/users/${userId}/unblock`);
  },
};