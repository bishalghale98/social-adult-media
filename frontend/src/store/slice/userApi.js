import { apiSlice } from '../apiSlice';

const userApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getUsers: builder.query({
            query: (params) => ({ url: '/users', params }),
            providesTags: (result) =>
                result?.users
                    ? [
                        ...result.users.map(({ userId }) => ({ type: 'Users', id: userId })),
                        { type: 'Users', id: 'LIST' },
                    ]
                    : [{ type: 'Users', id: 'LIST' }],
        }),

        updateProfile: builder.mutation({
            query: (profileData) => ({ url: '/me/profile', method: 'PATCH', data: profileData }),
            // Optimistic update on the Me cache
            async onQueryStarted(profileData, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    apiSlice.util.updateQueryData('getMe', undefined, (draft) => {
                        if (draft.profile) {
                            Object.assign(draft.profile, profileData);
                        }
                    })
                );
                try {
                    await queryFulfilled;
                } catch {
                    patchResult.undo();
                }
            },
        }),
    }),
    overrideExisting: false,
});

export const {
    useGetUsersQuery,
    useUpdateProfileMutation,
} = userApi;
