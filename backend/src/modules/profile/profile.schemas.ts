import { z } from 'zod';

export const updateProfileSchema = z.object({
    bio: z.string().max(300, 'Bio must be at most 300 characters').optional(),
    city: z.string().min(2).max(100).optional(),
    visibility: z.enum(['PUBLIC', 'HIDDEN']).optional(),
    interestedIn: z.enum(['MALE', 'FEMALE', 'ANY']).optional(),
});
