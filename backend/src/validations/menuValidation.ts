import { z } from "zod";

export const createMenuSchema = z.object({
  name: z.string().min(1).max(100),
  price: z.number().int().positive(),
  description: z.string().optional(),
  imageUrl: z.string().url().max(500).optional(),
  category: z.enum([
    "ROLLS",
    "SNACKS",
    "BARBEQUE_SNACKS",
    "FRY_SPECIALITIES",
    "MAIN_COURSE_VEG",
    "INDIAN_BREADS",
    "CHICKEN_CURRIES",
    "MUTTON_CURRIES",
    "MOMO_MANIA",
    "RICE_AND_BIRYANI",
    "CHINESE_WOK",
    "GYM_DIET_FOOD",
  ]),
  type: z.enum(["VEG", "NON_VEG", "EGG"]).optional(),
  restaurantId: z.string().uuid(),
});
