import { IAdminRepository } from '../interfaces/IAdminRepository';
import { IAdminDocument, AdminModel } from '../../models/Admin';
import { IAdmin } from '../../types/User';

export class AdminRepository implements IAdminRepository {
  async findByEmail(email: string): Promise<IAdmin | null> {
    const adminDocument = await AdminModel.findOne({ email });
    return adminDocument ? adminDocument.toObject() : null;
  }

  async create(admin: Omit<IAdmin, '_id' | 'createdAt' | 'updatedAt'>): Promise<IAdmin> {
    const adminDocument = new AdminModel(admin);
    const savedAdmin = await adminDocument.save();
    return savedAdmin.toObject();
  }
}