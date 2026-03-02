import prisma from '../../config/prisma';

interface DiscoveryFilters {
    gender?: string;
    interestedIn?: string;
    city?: string;
    minAge?: number;
    maxAge?: number;
    page?: number;
    limit?: number;
}

export class DiscoveryService {
    static async searchUsers(userId: string, filters: DiscoveryFilters) {
        const page = filters.page || 1;
        const limit = Math.min(filters.limit || 20, 50);
        const skip = (page - 1) * limit;

        // Get blocked user IDs (both directions)
        const blocks = await prisma.block.findMany({
            where: {
                OR: [{ blockerId: userId }, { blockedId: userId }],
            },
            select: { blockerId: true, blockedId: true },
        });
        const blockedIds = new Set<string>();
        blocks.forEach((b: { blockerId: string; blockedId: string }) => {
            blockedIds.add(b.blockerId);
            blockedIds.add(b.blockedId);
        });
        blockedIds.delete(userId);

        // Build where clause
        const where: Record<string, unknown> = {
            userId: {
                notIn: [userId, ...Array.from(blockedIds)],
            },
            visibility: 'PUBLIC',
            user: {
                status: 'ACTIVE',
            },
        };

        if (filters.gender) {
            where.gender = filters.gender;
        }
        if (filters.interestedIn) {
            where.interestedIn = filters.interestedIn;
        }
        if (filters.city) {
            where.city = { contains: filters.city, mode: 'insensitive' };
        }

        // Age filtering
        if (filters.minAge || filters.maxAge) {
            const now = new Date();
            const dobFilter: Record<string, Date> = {};
            if (filters.maxAge) {
                const minDate = new Date(now.getFullYear() - filters.maxAge - 1, now.getMonth(), now.getDate());
                dobFilter.gte = minDate;
            }
            if (filters.minAge) {
                const maxDate = new Date(now.getFullYear() - filters.minAge, now.getMonth(), now.getDate());
                dobFilter.lte = maxDate;
            }
            where.dob = dobFilter;
        }

        const [profiles, total] = await Promise.all([
            prisma.profile.findMany({
                where: where as any,
                skip,
                take: limit,
                orderBy: { lastActiveAt: 'desc' },
                select: {
                    userId: true,
                    username: true,
                    gender: true,
                    interestedIn: true,
                    city: true,
                    bio: true,
                    dob: true,
                    lastActiveAt: true,
                },
            }),
            prisma.profile.count({ where: where as any }),
        ]);

        // Compute age from dob, remove dob from response
        const results = profiles.map((p: { userId: string; username: string; gender: string; interestedIn: string; city: string; bio: string | null; dob: Date; lastActiveAt: Date | null }) => {
            const now = new Date();
            const age = now.getFullYear() - p.dob.getFullYear();
            const { dob: _dob, ...rest } = p;
            return { ...rest, age };
        });

        return {
            users: results,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
}
