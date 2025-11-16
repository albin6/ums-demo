import { IUser } from '../../types/User';

export interface IUserRepository {
  create(user: Omit<IUser, '_id' | 'createdAt' | 'updatedAt'>): Promise<IUser>;
  findByEmail(email: string): Promise<IUser | null>;
  findById(id: string): Promise<IUser | null>;
  findAll(page: number, limit: number, search?: string): Promise<{ data: IUser[]; total: number }>;
  update(id: string, user: Partial<IUser>): Promise<IUser | null>;
  delete(id: string): Promise<boolean>;
}