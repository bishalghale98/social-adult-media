import { apiSlice } from '../apiSlice';

const adminApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getReports: builder.query({
            query: (params) => ({ url: '/admin/reports', params }),
            providesTags: ['Reports'],
        }),

        reviewReport: builder.mutation({
            query: (id) => ({ url: `/admin/reports/${id}/review`, method: 'POST' }),
            invalidatesTags: ['Reports'],
        }),

        suspendUser: builder.mutation({
            query: (userId) => ({ url: `/admin/users/${userId}/suspend`, method: 'POST' }),
        }),

        banUser: builder.mutation({
            query: (userId) => ({ url: `/admin/users/${userId}/ban`, method: 'POST' }),
        }),
    }),
    overrideExisting: false,
});

export const {
    useGetReportsQuery,
    useReviewReportMutation,
    useSuspendUserMutation,
    useBanUserMutation,
} = adminApi;
