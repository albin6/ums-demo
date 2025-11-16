export interface IUser {
  _id?: string;
  name: string;
  email: string;
  password: string;
  profileImage?: string;
  isBlocked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAdmin {
  _id?: string;
  email: string;
  password: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
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