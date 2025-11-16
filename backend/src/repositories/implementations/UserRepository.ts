import { IUserRepository } from '../interfaces/IUserRepository';
import { IUserDocument, UserModel } from '../../models/User';
import { IUser } from '../../types/User';

export class UserRepository implements IUserRepository {
  async create(user: Omit<IUser, '_id' | 'createdAt' | 'updatedAt'>): Promise<IUser> {
    const userDocument = new UserModel(user);
    const savedUser = await userDocument.save();
    return savedUser.toObject();
  }

  async findByEmail(email: string): Promise<IUser | null> {
    const userDocument = await UserModel.findOne({ email });
    return userDocument ? userDocument.toObject() : null;
  }

  async findById(id: string): Promise<IUser | null> {
    const userDocument = await UserModel.findById(id);
    return userDocument ? userDocument.toObject() : null;
  }

  async findAll(page: number, limit: number, search?: string): Promise<{ data: IUser[]; total: number }> {
    const query: any = {};
    
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { name: { $regex: searchRegex } },
        { email: { $regex: searchRegex } }
      ];
    }

    const total = await UserModel.countDocuments(query);
    const users = await UserModel.find(query)
      .sort({ createdAt: -1 }) // Sort by latest creation date (descending)
      .skip((page - 1) * limit)
      .limit(limit);

    return {
      data: users.map(user => user.toObject()),
      total
    };
  }

  async update(id: string, user: Partial<IUser>): Promise<IUser | null> {
    const updatedUser = await UserModel.findByIdAndUpdate(
      id,
      { ...user, updatedAt: new Date() },
      { new: true }
    );
    return updatedUser ? updatedUser.toObject() : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await UserModel.deleteOne({ _id: id });
    return result.deletedCount > 0;
  }
}