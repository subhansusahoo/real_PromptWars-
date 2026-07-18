// AI Service for generating motivational messages and activities
import { OpenAI } from 'openai';
import { prisma } from '../index';
import { AppError } from '../middleware/errorHandler';

export class AIService {
  private openai: OpenAI;

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new AppError(500, 'OpenAI API key not configured');
    }
    this.openai = new OpenAI({ apiKey });
  }

  async generateMotivationalMessage(
    habitName: string,
    habitCategory: string,
    streakDays: number
  ): Promise<string> {
    try {
      const prompt = `You are a compassionate habit-breaking coach. Generate a personalized, uplifting motivational message for someone who is trying to overcome ${habitName} (category: ${habitCategory}). They have successfully maintained a ${streakDays}-day streak. The message should be:
- Concise (2-3 sentences max)
- Genuinely encouraging and empathetic
- Specific to their habit
- Focus on their progress and strength
Do not mention relapse or failure. Only provide the message text, no additional commentary.`;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 150,
        temperature: 0.7,
      });

      return (
        response.choices[0]?.message?.content ||
        'You are stronger than you think. Keep going!'
      );
    } catch (error) {
      console.error('AI Service error:', error);
      throw new AppError(500, 'Failed to generate motivational message');
    }
  }

  async generatePanicResponse(
    habitName: string,
    habitCategory: string
  ): Promise<{ message: string; activities: Array<{ title: string; description: string; duration: number }> }> {
    try {
      const prompt = `You are an expert behavioral psychologist and habit-breaking coach. Someone is experiencing an urge to relapse with ${habitName} (category: ${habitCategory}). 

Generate a compassionate response with:
1. A brief motivational message (1-2 sentences) to help them through this moment
2. A JSON array of 3-4 quick distraction activities with this format:
[
  {"title": "activity name", "description": "brief description", "duration": 5}
]

Activities should be:
- Quick (5-15 minutes)
- Engaging and actionable
- Appropriate for their situation
- Include physical, mental, and social options

Respond ONLY with valid JSON in this format:
{
  "message": "your motivational message",
  "activities": [{"title": "...", "description": "...", "duration": 5}]
}`;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 300,
        temperature: 0.8,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('Empty response from AI');
      }

      const parsed = JSON.parse(content);
      return {
        message: parsed.message || 'You can get through this. Take a deep breath.',
        activities: Array.isArray(parsed.activities) ? parsed.activities : [],
      };
    } catch (error) {
      console.error('AI Service error:', error);
      // Fallback response
      return {
        message:
          'You can get through this moment. Remember why you started. Take a deep breath and try one of these activities.',
        activities: [
          {
            title: 'Deep Breathing',
            description: 'Practice 5 minutes of slow, deep breathing',
            duration: 5,
          },
          {
            title: 'Walk Outside',
            description: 'Take a short walk in fresh air',
            duration: 10,
          },
          {
            title: 'Call a Friend',
            description: 'Reach out to someone supportive',
            duration: 10,
          },
          {
            title: 'Journal Your Feelings',
            description: 'Write down what you are feeling right now',
            duration: 8,
          },
        ],
      };
    }
  }
}
