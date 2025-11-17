import { IAdminService } from "../interfaces/IAdminService";
import { IAdminRepository } from "../../repositories/interfaces/IAdminRepository";
import { IUserRepository } from "../../repositories/interfaces/IUserRepository";
import { ILoginResponse, IUser, IUserResponse } from "../../types/User";
import { comparePassword } from "../../utils/auth/password";
import { generateToken } from "../../utils/auth/token";
import { hashPassword } from "../../utils/auth/password";

export class AdminService implements IAdminService {
  constructor(
    private adminRepository: IAdminRepository,
    private userRepository: IUserRepository
  ) {}

  async login(email: string, password: string): Promise<ILoginResponse> {
    const admin = await this.adminRepository.findByEmail(email);
    if (!admin) {
      throw new Error("Invalid email or password");
    }

    const isPasswordValid = await comparePassword(password, admin.password);
    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }

    const token = generateToken({
      id: admin._id,
      email: admin.email,
      role: "admin",
    });

    return {
      token,
      user: {
        id: admin._id as string,
        name: admin.name,
        email: admin.email,
      },
    };
  }

  async getUsers(
    page: number,
    limit: number,
    search?: string
  ): Promise<{
    data: IUserResponse[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const result = await this.userRepository.findAll(page, limit, search);

    const totalPages = Math.ceil(result.total / limit);

    const users = result.data.map((user) => ({
      _id: user._id,
      name: user.name,
      email: user.email,
      profileImage: user.profileImage,
      isBlocked: user.isBlocked,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }));

    return {
      data: users,
      total: result.total,
      page,
      limit,
      totalPages,
    };
  }

  async blockUser(userId: string): Promise<IUserResponse> {
    const user = await this.userRepository.update(userId, { isBlocked: true });

    if (!user) {
      throw new Error("User not found");
    }

    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      profileImage: user.profileImage,
      isBlocked: user.isBlocked,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async unblockUser(userId: string): Promise<IUserResponse> {
    const user = await this.userRepository.update(userId, { isBlocked: false });

    if (!user) {
      throw new Error("User not found");
    }

    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      profileImage: user.profileImage,
      isBlocked: user.isBlocked,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async createUser(userData: {
    name: string;
    email: string;
    password: string;
  }): Promise<IUserResponse> {
    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    const hashedPassword = await hashPassword(userData.password);

    const user = await this.userRepository.create({
      ...userData,
      password: hashedPassword,
      isBlocked: false,
    });

    if (!user) {
      throw new Error("Failed to create user");
    }

    return {
      _id: user._id as string,
      name: user.name,
      email: user.email,
      profileImage: user.profileImage,
      isBlocked: user.isBlocked,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
