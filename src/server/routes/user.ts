// User profile routes
import { Router, Request, Response } from 'express';
import { prisma } from '../index';
import { asyncHandler, AppError } from '../middleware/errorHandler';

const router = Router();

// Get user profile
router.get(
  '/profile',
  asyncHandler(async (req: Request, res: Response) => {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    res.status(200).json({
      status: 'success',
      data: user,
    });
  })
);

// Get user statistics
router.get(
  '/stats',
  asyncHandler(async (req: Request, res: Response) => {
    const habits = await prisma.habit.findMany({
      where: { userId: req.userId },
    });

    const totalHabits = habits.length;
    const activeHabits = habits.filter((h) => h.isActive).length;
    const totalCheckIns = habits.reduce((sum, h) => sum + h.totalCheckIns, 0);
    const totalSuccessfulDays = habits.reduce(
      (sum, h) => sum + h.successfulDays,
      0
    );
    const longestOverallStreak = Math.max(
      ...(habits.map((h) => h.longestStreak) || [0])
    );

    res.status(200).json({
      status: 'success',
      data: {
        totalHabits,
        activeHabits,
        totalCheckIns,
        totalSuccessfulDays,
        successRate:
          totalCheckIns > 0
            ? Math.round((totalSuccessfulDays / totalCheckIns) * 100)
            : 0,
        longestOverallStreak,
      },
    });
  })
);

export default router;
