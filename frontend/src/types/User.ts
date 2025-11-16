export interface IUser {
  _id: string;
  name: string;
  email: string;
  profileImage?: string;
  isBlocked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IAdmin {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface ILoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export interface IPaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}