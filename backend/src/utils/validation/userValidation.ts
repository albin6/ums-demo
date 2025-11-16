import { z } from 'zod';

export const userSignupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters long').max(50),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

export const userLoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const userProfileUpdateSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters long').max(50).optional(),
  email: z.string().email('Invalid email address').optional(),
});

export const adminLoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export type UserSignupData = z.infer<typeof userSignupSchema>;
export type UserLoginData = z.infer<typeof userLoginSchema>;
export type UserProfileUpdateData = z.infer<typeof userProfileUpdateSchema>;
export type AdminLoginData = z.infer<typeof adminLoginSchema>;