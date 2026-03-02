import prisma from '../../config/prisma';
import { sanitize } from '../../utils/sanitize';

export class ProfileService {
    static async getMyProfile(userId: string) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { profile: true },
        });
        if (!user) throw new Error('User not found');

        return {
            id: user.id,
            email: user.email,
            role: user.role,
            status: user.status,
            isVerified: user.isVerified,
            consentAcceptedAt: user.consentAcceptedAt,
            profile: user.profile,
        };
    }

    static async updateProfile(
        userId: string,
        data: { bio?: string; city?: string; visibility?: 'PUBLIC' | 'HIDDEN'; interestedIn?: 'MALE' | 'FEMALE' | 'ANY' }
    ) {
        const updateData: any = {};
        if (data.bio !== undefined) updateData.bio = sanitize(data.bio);
        if (data.city !== undefined) updateData.city = sanitize(data.city);
        if (data.visibility !== undefined) updateData.visibility = data.visibility;
        if (data.interestedIn !== undefined) updateData.interestedIn = data.interestedIn;

        const profile = await prisma.profile.update({
            where: { userId },
            data: updateData,
        });

        return profile;
    }
}
