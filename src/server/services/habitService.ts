// Habit Service for habit management operations
import { prisma } from '../index';
import { AppError } from '../middleware/errorHandler';
import { PREDEFINED_ADDICTIONS } from '../constants/addictions';

export class HabitService {
  static async createHabit(
    userId: string,
    name: string,
    category: string,
    description?: string,
    reason?: string
  ): Promise<any> {
    if (!name || name.trim().length === 0) {
      throw new AppError(400, 'Habit name is required');
    }

    if (!category || category.trim().length === 0) {
      throw new AppError(400, 'Category is required');
    }

    // Validate category
    const validCategories = [
      ...PREDEFINED_ADDICTIONS.map((a) => a.id),
      'custom',
    ];
    if (!validCategories.includes(category.toLowerCase())) {
      throw new AppError(
        400,
        `Invalid category. Must be one of: ${validCategories.join(', ')}`
      );
    }

    const habit = await prisma.habit.create({
      data: {
        userId,
        name: name.trim(),
        category: category.toLowerCase(),
        description: description?.trim(),
        reason: reason?.trim(),
      },
    });

    return habit;
  }

  static async getHabits(userId: string): Promise<any[]> {
    const habits = await prisma.habit.findMany({
      where: { userId },
      include: {
        checkIns: {
          orderBy: { date: 'desc' },
          take: 30,
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return habits;
  }

  static async getHabitById(habitId: string, userId: string): Promise<any> {
    const habit = await prisma.habit.findUnique({
      where: { id: habitId },
      include: {
        checkIns: {
          orderBy: { date: 'desc' },
          take: 30,
        },
        panicLogs: {
          orderBy: { triggeredAt: 'desc' },
          take: 5,
        },
      },
    });

    if (!habit) {
      throw new AppError(404, 'Habit not found');
    }

    if (habit.userId !== userId) {
      throw new AppError(403, 'Unauthorized to access this habit');
    }

    return habit;
  }

  static async updateHabit(
    habitId: string,
    userId: string,
    updateData: Partial<any>
  ): Promise<any> {
    const habit = await this.getHabitById(habitId, userId);

    const updated = await prisma.habit.update({
      where: { id: habitId },
      data: {
        name: updateData.name || habit.name,
        description: updateData.description || habit.description,
        reason: updateData.reason || habit.reason,
      },
    });

    return updated;
  }

  static async deleteHabit(habitId: string, userId: string): Promise<void> {
    const habit = await this.getHabitById(habitId, userId);

    await prisma.habit.delete({
      where: { id: habitId },
    });
  }

  static async resetStreak(habitId: string, userId: string): Promise<any> {
    const habit = await this.getHabitById(habitId, userId);

    // Update longest streak if current streak is longer
    const longestStreak = Math.max(habit.longestStreak, habit.streakCount);

    const updated = await prisma.habit.update({
      where: { id: habitId },
      data: {
        streakCount: 0,
        longestStreak,
      },
    });

    return updated;
  }

  static async calculateStreak(habitId: string): Promise<number> {
    const checkIns = await prisma.checkIn.findMany({
      where: { habitId },
      orderBy: { date: 'desc' },
    });

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (const checkIn of checkIns) {
      const checkInDate = new Date(checkIn.date);
      checkInDate.setHours(0, 0, 0, 0);

      if (checkIn.status === 'success') {
        const expectedDate = new Date(today);
        expectedDate.setDate(expectedDate.getDate() - streak);

        if (
          checkInDate.getTime() === expectedDate.getTime()
        ) {
          streak++;
        } else {
          break;
        }
      } else {
        break;
      }
    }

    return streak;
  }
}
