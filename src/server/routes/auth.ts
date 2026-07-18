// Authentication routes
import { Router, Request, Response } from 'express';
import { AuthService } from '../services/authService';
import { asyncHandler, AppError } from '../middleware/errorHandler';

const router = Router();

interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

router.post(
  '/register',
  asyncHandler(async (req: Request, res: Response) => {
    const { email, password, name } = req.body as RegisterRequest;

    if (!email || !password || !name) {
      throw new AppError(
        400,
        'Email, password, and name are required'
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new AppError(400, 'Please provide a valid email address');
    }

    const result = await AuthService.register(email, password, name);

    res.status(201).json({
      status: 'success',
      data: result,
    });
  })
);

router.post(
  '/login',
  asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body as LoginRequest;

    if (!email || !password) {
      throw new AppError(400, 'Email and password are required');
    }

    const result = await AuthService.login(email, password);

    res.status(200).json({
      status: 'success',
      data: result,
    });
  })
);

export default router;
