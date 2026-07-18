// Habit routes
import { Router, Request, Response } from 'express';
import { HabitService } from '../services/habitService';
import { asyncHandler, AppError } from '../middleware/errorHandler';
import { PREDEFINED_ADDICTIONS } from '../constants/addictions';

const router = Router();

// Get predefined addictions
router.get(
  '/predefined',
  asyncHandler(async (req: Request, res: Response) => {
    res.status(200).json({
      status: 'success',
      data: PREDEFINED_ADDICTIONS,
    });
  })
);

// Get all habits for user
router.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const habits = await HabitService.getHabits(req.userId!);

    res.status(200).json({
      status: 'success',
      data: habits,
    });
  })
);

// Create new habit
router.post(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const { name, category, description, reason } = req.body;

    const habit = await HabitService.createHabit(
      req.userId!,
      name,
      category,
      description,
      reason
    );

    res.status(201).json({
      status: 'success',
      data: habit,
    });
  })
);

// Get specific habit
router.get(
  '/:habitId',
  asyncHandler(async (req: Request, res: Response) => {
    const habit = await HabitService.getHabitById(
      req.params.habitId,
      req.userId!
    );

    res.status(200).json({
      status: 'success',
      data: habit,
    });
  })
);

// Update habit
router.put(
  '/:habitId',
  asyncHandler(async (req: Request, res: Response) => {
    const updated = await HabitService.updateHabit(
      req.params.habitId,
      req.userId!,
      req.body
    );

    res.status(200).json({
      status: 'success',
      data: updated,
    });
  })
);

// Delete habit
router.delete(
  '/:habitId',
  asyncHandler(async (req: Request, res: Response) => {
    await HabitService.deleteHabit(req.params.habitId, req.userId!);

    res.status(200).json({
      status: 'success',
      message: 'Habit deleted successfully',
    });
  })
);

// Reset streak
router.post(
  '/:habitId/reset-streak',
  asyncHandler(async (req: Request, res: Response) => {
    const updated = await HabitService.resetStreak(
      req.params.habitId,
      req.userId!
    );

    res.status(200).json({
      status: 'success',
      data: updated,
    });
  })
);

export default router;
