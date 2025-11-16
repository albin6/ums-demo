import { IUserService } from '../interfaces/IUserService';
import { IUserRepository } from '../../repositories/interfaces/IUserRepository';
import { IUser, IPaginatedResponse } from '../../types/User';
import { hashPassword, comparePassword } from '../../utils/auth/password';
import { generateToken } from '../../utils/auth/token';
import { UserSignupData, UserLoginData, UserProfileUpdateData } from '../../utils/validation/userValidation';

export class UserService implements IUserService {
  constructor(private userRepository: IUserRepository) {}

  async signup(userData: Omit<IUser, '_id' | 'createdAt' | 'updatedAt' | 'isBlocked'>): Promise<IUser> {
    // Validate input data
    const validatedData = {
      name: userData.name,
      email: userData.email,
      password: userData.password,
      profileImage: userData.profileImage
    };

    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(validatedData.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Hash the password
    const hashedPassword = await hashPassword(validatedData.password);

    // Create user with hashed password
    const userToCreate = {
      ...validatedData,
      password: hashedPassword,
      isBlocked: false
    };

    return await this.userRepository.create(userToCreate);
  }

  async login(email: string, password: string): Promise<{ token: string; user: { id: string; name: string; email: string } }> {
    // Validate input data
    const validatedData = { email, password };
    
    // Find user by email
    const user = await this.userRepository.findByEmail(validatedData.email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Check if user is blocked
    if (user.isBlocked) {
      throw new Error('Your account has been blocked. Please contact admin.');
    }

    // Compare password
    const isPasswordValid = await comparePassword(validatedData.password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Generate JWT token
    const token = generateToken({
      id: user._id,
      email: user.email,
      role: 'user'
    });

    return {
      token,
      user: {
        id: user._id as string,
        name: user.name,
        email: user.email
      }
    };
  }

  async getProfile(userId: string): Promise<IUser | null> {
    return await this.userRepository.findById(userId);
  }

  async updateProfile(userId: string, userData: Partial<IUser>): Promise<IUser | null> {
    // If email is being updated, check if another user already has this email
    if (userData.email) {
      const existingUser = await this.userRepository.findByEmail(userData.email);
      if (existingUser && existingUser._id?.toString() !== userId) {
        throw new Error('Email is already in use by another account');
      }
    }

    // Update user profile
    return await this.userRepository.update(userId, userData);
  }

  async getUsers(page: number, limit: number, search?: string): Promise<IPaginatedResponse<IUser>> {
    const result = await this.userRepository.findAll(page, limit, search);
    
    const totalPages = Math.ceil(result.total / limit);
    
    return {
      data: result.data,
      total: result.total,
      page,
      limit,
      totalPages
    };
  }

  async blockUser(userId: string): Promise<IUser | null> {
    return await this.userRepository.update(userId, { isBlocked: true });
  }

  async unblockUser(userId: string): Promise<IUser | null> {
    return await this.userRepository.update(userId, { isBlocked: false });
  }
}