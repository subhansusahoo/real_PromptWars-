// AI routes for motivational messages and panic button
import { Router, Request, Response } from 'express';
import { AIService } from '../services/aiService';
import { prisma } from '../index';
import { asyncHandler, AppError } from '../middleware/errorHandler';

const router = Router();

// Generate motivational message
router.post(
  '/motivational-message',
  asyncHandler(async (req: Request, res: Response) => {
    const { habitId } = req.body;

    if (!habitId) {
      throw new AppError(400, 'habitId is required');
    }

    const habit = await prisma.habit.findUnique({
      where: { id: habitId },
    });

    if (!habit) {
      throw new AppError(404, 'Habit not found');
    }

    if (habit.userId !== req.userId) {
      throw new AppError(403, 'Unauthorized');
    }

    const aiService = new AIService();
    const message = await aiService.generateMotivationalMessage(
      habit.name,
      habit.category,
      habit.streakCount
    );

    res.status(200).json({
      status: 'success',
      data: { message },
    });
  })
);

// Panic button - generate motivational message and activities
router.post(
  '/panic-support',
  asyncHandler(async (req: Request, res: Response) => {
    const { habitId } = req.body;

    if (!habitId) {
      throw new AppError(400, 'habitId is required');
    }

    const habit = await prisma.habit.findUnique({
      where: { id: habitId },
    });

    if (!habit) {
      throw new AppError(404, 'Habit not found');
    }

    if (habit.userId !== req.userId) {
      throw new AppError(403, 'Unauthorized');
    }

    const aiService = new AIService();
    const { message, activities } = await aiService.generatePanicResponse(
      habit.name,
      habit.category
    );

    // Log panic button press
    await prisma.panicLog.create({
      data: {
        habitId,
        motivationalMessage: message,
        suggestedActivities: JSON.stringify(activities),
      },
    });

    res.status(200).json({
      status: 'success',
      data: {
        message,
        activities,
      },
    });
  })
);

export default router;
