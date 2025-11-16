import { IUser, IPaginatedResponse } from '../../types/User';

export interface IUserService {
  signup(userData: Omit<IUser, '_id' | 'createdAt' | 'updatedAt' | 'isBlocked'>): Promise<IUser>;
  login(email: string, password: string): Promise<{ token: string; user: { id: string; name: string; email: string } }>;
  getProfile(userId: string): Promise<IUser | null>;
  updateProfile(userId: string, userData: Partial<IUser>): Promise<IUser | null>;
  getUsers(page: number, limit: number, search?: string): Promise<IPaginatedResponse<IUser>>;
  blockUser(userId: string): Promise<IUser | null>;
  unblockUser(userId: string): Promise<IUser | null>;
}