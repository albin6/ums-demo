import { Request, Response } from 'express';
import { IAdminService } from '../../services/interfaces/IAdminService';
import { AdminLoginData } from '../../utils/validation/userValidation';
import { z } from 'zod';
import { container } from '../../di/Container';

export class AdminController {
  private adminService: IAdminService;

  constructor() {
    this.adminService = container.getService<IAdminService>('AdminService');
  }

  async login(req: Request, res: Response) {
    try {
      // Validate request body
      const validatedData = z.object({
        email: z.string().email('Invalid email address'),
        password: z.string().min(1, 'Password is required'),
      }).parse(req.body);

      const loginData = validatedData as AdminLoginData;

      const result = await this.adminService.login(loginData.email, loginData.password);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async getUsers(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = req.query.search as string || undefined;

      const result = await this.adminService.getUsers(page, limit, search);

      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async blockUser(req: Request, res: Response) {
    try {
      const userId = req.params.id;

      const result = await this.adminService.blockUser(userId);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async unblockUser(req: Request, res: Response) {
    try {
      const userId = req.params.id;

      const result = await this.adminService.unblockUser(userId);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async createUser(req: Request, res: Response) {
    try {
      // Validate request body
      const validatedData = z.object({
        name: z.string().min(2, 'Name must be at least 2 characters'),
        email: z.string().email('Invalid email address'),
        password: z.string().min(6, 'Password must be at least 6 characters'),
      }).parse(req.body);

      const result = await this.adminService.createUser(validatedData);
      res.status(201).json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}