"use server";

import { generatePersonalizedRecommendations } from "@/ai/flows/personalized-recommendations";
import { z } from "zod";

const recommendationsSchema = z.object({
  userHistory: z
    .string()
    .min(10, "Please provide more details about your activity."),
  userSegmentation: z.string(),
});

export type RecommendationsState = {
  recommendations?: string;
  error?: string;
  message?: 'success' | 'error';
};

export async function getRecommendations(
  prevState: RecommendationsState,
  formData: FormData
): Promise<RecommendationsState> {
  const validatedFields = recommendationsSchema.safeParse({
    userHistory: formData.get("userHistory"),
    userSegmentation: formData.get("userSegmentation"),
  });

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors.userHistory?.[0],
      message: 'error',
    };
  }

  try {
    const result = await generatePersonalizedRecommendations(
      validatedFields.data
    );
    return { recommendations: result.recommendations, message: 'success' };
  } catch (error) {
    console.error(error);
    return {
      error: "Failed to generate recommendations. Please try again later.",
      message: 'error',
    };
  }
}
