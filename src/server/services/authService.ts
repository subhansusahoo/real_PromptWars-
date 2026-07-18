// Authentication service with JWT
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../index';
import { AppError } from '../middleware/errorHandler';

interface TokenPayload {
  userId: string;
}

export class AuthService {
  static async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  static async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  static async generateToken(userId: string): Promise<string> {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new AppError(500, 'JWT secret not configured');
    }

    return jwt.sign({ userId } as TokenPayload, secret, {
      expiresIn: '7d',
    });
  }

  static async register(
    email: string,
    password: string,
    name: string
  ): Promise<{ user: any; token: string }> {
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new AppError(409, 'Email already registered');
    }

    // Validate password strength
    if (password.length < 8) {
      throw new AppError(
        400,
        'Password must be at least 8 characters long'
      );
    }

    const hashedPassword = await this.hashPassword(password);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    const token = await this.generateToken(user.id);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      token,
    };
  }

  static async login(
    email: string,
    password: string
  ): Promise<{ user: any; token: string }> {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new AppError(401, 'Invalid email or password');
    }

    const passwordMatch = await this.verifyPassword(password, user.password);

    if (!passwordMatch) {
      throw new AppError(401, 'Invalid email or password');
    }

    const token = await this.generateToken(user.id);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      token,
    };
  }
}
