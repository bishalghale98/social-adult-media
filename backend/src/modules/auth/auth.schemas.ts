import { z } from 'zod';

export const registerSchema = z.object({
    email: z.string().email('Invalid email'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    username: z
        .string()
        .min(3, 'Username must be at least 3 characters')
        .max(30, 'Username must be at most 30 characters')
        .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
    gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
    interestedIn: z.enum(['MALE', 'FEMALE', 'ANY']),
    dob: z.string().refine(
        (val) => {
            const date = new Date(val);
            const now = new Date();
            const age = now.getFullYear() - date.getFullYear();
            return age >= 18;
        },
        { message: 'You must be at least 18 years old' }
    ),
    city: z.string().min(2, 'City is required').max(100),
});

export const loginSchema = z.object({
    email: z.string().email('Invalid email'),
    password: z.string().min(1, 'Password is required'),
});

export const refreshSchema = z.object({
    refreshToken: z.string().min(1, 'Refresh token is required'),
});
