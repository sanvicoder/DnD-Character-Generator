import { z } from 'zod';

export const characterInputSchema = z.object({
  name: z.string().min(2),
  race: z.string(),
  clazz: z.string(),
  background: z.string(),
});

export const characterOutputSchema = characterInputSchema.extend({
  personality: z.string(),
  backstory: z.string(),
});
