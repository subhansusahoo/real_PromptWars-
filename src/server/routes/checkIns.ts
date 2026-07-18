// Check-in routes for daily tracking
import { Router, Request, Response } from 'express';
import { prisma } from '../index';
import { asyncHandler, AppError } from '../middleware/errorHandler';
import { HabitService } from '../services/habitService';

const router = Router();

interface CheckInRequest {
  habitId: string;
  status: 'success' | 'failed';
  notes?: string;
}

// Create check-in
router.post(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const { habitId, status, notes } = req.body as CheckInRequest;

    if (!habitId || !status) {
      throw new AppError(400, 'habitId and status are required');
    }

    if (!['success', 'failed'].includes(status)) {
      throw new AppError(400, 'Status must be either success or failed');
    }

    // Verify habit belongs to user
    const habit = await prisma.habit.findUnique({
      where: { id: habitId },
    });

    if (!habit) {
      throw new AppError(404, 'Habit not found');
    }

    if (habit.userId !== req.userId) {
      throw new AppError(403, 'Unauthorized');
    }

    // Check if already checked in today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingCheckIn = await prisma.checkIn.findFirst({
      where: {
        habitId,
        date: {
          gte: today,
          lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
        },
      },
    });

    if (existingCheckIn) {
      throw new AppError(
        409,
        'You have already checked in for this habit today'
      );
    }

    const checkIn = await prisma.checkIn.create({
      data: {
        habitId,
        userId: req.userId!,
        status,
        notes: notes?.trim(),
        date: new Date(),
      },
    });

    // Update habit statistics
    const totalCheckIns = await prisma.checkIn.count({
      where: { habitId },
    });

    const successfulDays = await prisma.checkIn.count({
      where: { habitId, status: 'success' },
    });

    const failedDays = await prisma.checkIn.count({
      where: { habitId, status: 'failed' },
    });

    const streak = await HabitService.calculateStreak(habitId);

    await prisma.habit.update({
      where: { id: habitId },
      data: {
        totalCheckIns,
        successfulDays,
        failedDays,
        streakCount: streak,
      },
    });

    res.status(201).json({
      status: 'success',
      data: checkIn,
    });
  })
);

// Get check-ins for a habit
router.get(
  '/habit/:habitId',
  asyncHandler(async (req: Request, res: Response) => {
    const { habitId } = req.params;

    // Verify habit belongs to user
    const habit = await prisma.habit.findUnique({
      where: { id: habitId },
    });

    if (!habit) {
      throw new AppError(404, 'Habit not found');
    }

    if (habit.userId !== req.userId) {
      throw new AppError(403, 'Unauthorized');
    }

    const checkIns = await prisma.checkIn.findMany({
      where: { habitId },
      orderBy: { date: 'desc' },
      take: 100,
    });

    res.status(200).json({
      status: 'success',
      data: checkIns,
    });
  })
);

// Get today's check-in for a habit
router.get(
  '/habit/:habitId/today',
  asyncHandler(async (req: Request, res: Response) => {
    const { habitId } = req.params;

    const habit = await prisma.habit.findUnique({
      where: { id: habitId },
    });

    if (!habit) {
      throw new AppError(404, 'Habit not found');
    }

    if (habit.userId !== req.userId) {
      throw new AppError(403, 'Unauthorized');
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const checkIn = await prisma.checkIn.findFirst({
      where: {
        habitId,
        date: {
          gte: today,
          lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
        },
      },
    });

    res.status(200).json({
      status: 'success',
      data: checkIn || null,
    });
  })
);

export default router;
