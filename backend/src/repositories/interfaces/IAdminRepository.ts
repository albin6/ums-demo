import { IAdmin } from '../../types/User';

export interface IAdminRepository {
  findByEmail(email: string): Promise<IAdmin | null>;
  create(admin: Omit<IAdmin, '_id' | 'createdAt' | 'updatedAt'>): Promise<IAdmin>;
}