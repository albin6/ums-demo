import { Request, Response } from 'express';
import { IUserService } from '../../services/interfaces/IUserService';
import { authenticate } from '../../middleware/auth/auth';
import { z } from 'zod';
import { container } from '../../di/Container';

export class UserController {
  private userService: IUserService;

  constructor() {
    this.userService = container.getService<IUserService>('UserService');
  }

  async signup(req: Request, res: Response) {
    try {
      // Validate request body
      const validatedData = z.object({
        name: z.string().min(2, 'Name must be at least 2 characters long').max(50),
        email: z.string().email('Invalid email address'),
        password: z.string().min(6, 'Password must be at least 6 characters long'),
      }).parse(req.body);

      const result = await this.userService.signup(validatedData);

      // Return only necessary fields (exclude password)
      const { password, ...userWithoutPassword } = result;
      res.status(201).json(userWithoutPassword);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async login(req: Request, res: Response) {
    try {
      // Validate request body
      const validatedData = z.object({
        email: z.string().email('Invalid email address'),
        password: z.string().min(1, 'Password is required'),
      }).parse(req.body);

      const result = await this.userService.login(validatedData.email, validatedData.password);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async getProfile(req: Request, res: Response) {
    try {
      // Using middleware to get userId from token
      const userId = (req as any).userId;

      const user = await this.userService.getProfile(userId);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Exclude password from response
      const { password, ...userWithoutPassword } = user;

      return res.status(200).json(userWithoutPassword);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async updateProfile(req: Request, res: Response) {
    try {
      // Using middleware to get userId from token
      const userId = (req as any).userId;

      // Validate request body
      const validatedData = z.object({
        name: z.string().min(2, 'Name must be at least 2 characters long').max(50).optional(),
        email: z.string().email('Invalid email address').optional(),
      }).parse(req.body);

      const user = await this.userService.updateProfile(userId, validatedData);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Exclude password from response
      const { password, ...userWithoutPassword } = user;

      return res.status(200).json(userWithoutPassword);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }

  // Placeholder upload endpoint for profile image
  async uploadProfileImage(req: Request, res: Response) {
    try {
      // Using middleware to get userId from token
      const userId = (req as any).userId;

      // Validate that a file was uploaded
      if (!req.file) {
        return res.status(400).json({ message: 'No image file provided' });
      }

      // Construct the full URL for the uploaded image
      const imageUrl = `${req.protocol}://${req.get('host')}/uploads/profile/${req.file.filename}`;

      // Update user profile with the new image URL
      const updatedUser = await this.userService.updateProfile(userId, { profileImage: imageUrl });

      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Exclude password from response
      const { password, ...userWithoutPassword } = updatedUser;

      return res.status(200).json({
        message: 'Profile image uploaded successfully',
        user: userWithoutPassword
      });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }
}