import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../../config/prisma';
import { env } from '../../config/env';

interface RegisterInput {
    email: string;
    password: string;
    username: string;
    gender: 'MALE' | 'FEMALE' | 'OTHER';
    interestedIn: 'MALE' | 'FEMALE' | 'ANY';
    dob: string;
    city: string;
}

interface LoginInput {
    email: string;
    password: string;
}

function generateAccessToken(userId: string, role: string): string {
    return jwt.sign({ userId, role }, env.JWT_ACCESS_SECRET, {
        expiresIn: env.JWT_ACCESS_EXPIRES_IN,
    } as jwt.SignOptions);
}

function generateRefreshToken(userId: string): string {
    return jwt.sign({ userId }, env.JWT_REFRESH_SECRET, {
        expiresIn: env.JWT_REFRESH_EXPIRES_IN,
    } as jwt.SignOptions);
}

export class AuthService {
    static async register(data: RegisterInput) {
        // Check for existing email
        const existingEmail = await prisma.user.findUnique({
            where: { email: data.email },
        });
        if (existingEmail) {
            throw new Error('Email already registered');
        }

        // Check for existing username
        const existingUsername = await prisma.profile.findUnique({
            where: { username: data.username },
        });
        if (existingUsername) {
            throw new Error('Username already taken');
        }

        const passwordHash = await bcrypt.hash(data.password, 12);

        const user = await prisma.user.create({
            data: {
                email: data.email,
                passwordHash,
                profile: {
                    create: {
                        username: data.username,
                        gender: data.gender,
                        interestedIn: data.interestedIn,
                        dob: new Date(data.dob),
                        city: data.city,
                    },
                },
            },
            include: { profile: true },
        });

        const accessToken = generateAccessToken(user.id, user.role);
        const refreshToken = generateRefreshToken(user.id);

        return {
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                status: user.status,
                isVerified: user.isVerified,
                consentAcceptedAt: user.consentAcceptedAt,
                profile: user.profile,
            },
        };
    }

    static async login(data: LoginInput) {
        const user = await prisma.user.findUnique({
            where: { email: data.email },
            include: { profile: true },
        });

        if (!user) {
            throw new Error('Invalid email or password');
        }

        if (user.status === 'BANNED') {
            throw new Error('Your account has been banned');
        }

        if (user.status === 'SUSPENDED') {
            throw new Error('Your account has been suspended');
        }

        const validPassword = await bcrypt.compare(data.password, user.passwordHash);
        if (!validPassword) {
            throw new Error('Invalid email or password');
        }

        // Update last active
        if (user.profile) {
            await prisma.profile.update({
                where: { userId: user.id },
                data: { lastActiveAt: new Date() },
            });
        }

        const accessToken = generateAccessToken(user.id, user.role);
        const refreshToken = generateRefreshToken(user.id);

        return {
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                status: user.status,
                isVerified: user.isVerified,
                consentAcceptedAt: user.consentAcceptedAt,
                profile: user.profile,
            },
        };
    }

    static async refresh(refreshToken: string) {
        try {
            const decoded = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET) as {
                userId: string;
            };

            const user = await prisma.user.findUnique({
                where: { id: decoded.userId },
                select: { id: true, role: true, status: true },
            });

            if (!user || user.status !== 'ACTIVE') {
                throw new Error('User not found or inactive');
            }

            const newAccessToken = generateAccessToken(user.id, user.role);
            const newRefreshToken = generateRefreshToken(user.id);

            return { accessToken: newAccessToken, refreshToken: newRefreshToken };
        } catch {
            throw new Error('Invalid refresh token');
        }
    }

    static async acceptConsent(userId: string) {
        await prisma.user.update({
            where: { id: userId },
            data: { consentAcceptedAt: new Date() },
        });
        return { success: true };
    }
}
