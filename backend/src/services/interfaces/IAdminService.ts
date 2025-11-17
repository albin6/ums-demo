import { ILoginResponse, IUser, IUserResponse } from '../../types/User';

export interface IAdminService {
  login(email: string, password: string): Promise<ILoginResponse>;
  getUsers(page: number, limit: number, search?: string): Promise<{ data: IUserResponse[]; total: number; page: number; limit: number; totalPages: number }>;
  blockUser(userId: string): Promise<IUserResponse>;
  unblockUser(userId: string): Promise<IUserResponse>;
  createUser(userData: { name: string; email: string; password: string }): Promise<IUserResponse>;
}