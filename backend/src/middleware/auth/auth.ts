import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../../utils/auth/token';

interface AuthenticatedRequest extends Request {
  userId?: string;
  role?: string;
}

export const authenticate = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ message: 'Authentication token required' });
    }

    const decoded = verifyToken(token);
    req.userId = decoded.id;
    req.role = decoded.role;

    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

export const authorizeAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (req.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
  }

  return next();
};