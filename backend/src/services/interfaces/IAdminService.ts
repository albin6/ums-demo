import { ILoginResponse } from '../../types/User';

export interface IAdminService {
  login(email: string, password: string): Promise<ILoginResponse>;
  getUsers(page: number, limit: number, search?: string): Promise<{ data: any[]; total: number; page: number; limit: number; totalPages: number }>;
  blockUser(userId: string): Promise<any>;
  unblockUser(userId: string): Promise<any>;
}