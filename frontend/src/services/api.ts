import axios, { AxiosResponse } from "axios";
import { IUser, ILoginResponse, IPaginatedResponse } from "../types/User";

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

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

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("adminToken");

      const storeAccessModule = await import('./storeAccess');
      const { dispatchLogout } = storeAccessModule;

      const token = localStorage.getItem("token");
      const adminToken = localStorage.getItem("adminToken");

      if (token) {
        dispatchLogout('user');
      } else if (adminToken) {
        dispatchLogout('admin');
      }

      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export const userApi = {
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

  logout: async (): Promise<void> => {
    localStorage.removeItem("token");

    const storeAccessModule = await import('./storeAccess');
    const { dispatchLogout } = storeAccessModule;
    dispatchLogout('user');

    return Promise.resolve();
  },

  getProfile: (): Promise<AxiosResponse<IUser>> => {
    return apiClient.get("/users/profile");
  },

  updateProfile: (userData: Partial<IUser>): Promise<AxiosResponse<IUser>> => {
    return apiClient.put("/users/profile", userData);
  },

  uploadProfileImage: (file: File): Promise<AxiosResponse<any>> => {
    const formData = new FormData();
    formData.append('profileImage', file);

    return apiClient.post("/users/upload", formData, {
      headers: {
        'Content-Type': 'multipart-form-data',
      },
    });
  },
};

export const adminApi = {
  login: (credentials: {
    email: string;
    password: string;
  }): Promise<AxiosResponse<ILoginResponse>> => {
    return apiClient.post("/admin/login", credentials);
  },

  logout: async (): Promise<void> => {
    localStorage.removeItem("adminToken");

    const storeAccessModule = await import('./storeAccess');
    const { dispatchLogout } = storeAccessModule;
    dispatchLogout('admin');

    return Promise.resolve();
  },

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

  createUser: (userData: {
    name: string;
    email: string;
    password: string;
  }): Promise<AxiosResponse<IUser>> => {
    return apiClient.post("/admin/users", userData);
  },
};