import { z } from 'zod';

export const createArrivalFormSchema = z.object({
  busId: z.string().uuid(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'Please enter a valid date in YYYY-MM-DD format',
  }),
  departureTime: z.string().regex(/^\d{2}:\d{2}$/, {
    message: 'Please enter a valid time in HH:MM format',
  }),
  arrivalTime: z.string().regex(/^\d{2}:\d{2}$/, {
    message: 'Please enter a valid time in HH:MM format',
  }),
  scheduleId: z.string().uuid(),
  position: z.enum(['front', 'back']),
});
