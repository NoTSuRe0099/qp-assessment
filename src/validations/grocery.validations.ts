import { z } from 'zod';

// Define the shape of your data
export const GrocerySchema = z.object({
  name: z.string().nonempty(),
  price: z.number(),
  inventory: z.number().default(0),
});

// Define TypeScript types for your data
export type GroceryData = z.infer<typeof GrocerySchema>;
