import { apiSlice } from '../apiSlice';

const blockApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getBlocks: builder.query({
            query: () => ({ url: '/blocks' }),
            providesTags: ['Blocks'],
        }),

        unblock: builder.mutation({
            query: (blockedId) => ({ url: `/blocks/${blockedId}`, method: 'DELETE' }),
            // Optimistic update: remove from blocks list
            async onQueryStarted(blockedId, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    apiSlice.util.updateQueryData('getBlocks', undefined, (draft) => {
                        const index = draft.findIndex((b) => b.blockedId === blockedId);
                        if (index !== -1) draft.splice(index, 1);
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
    useGetBlocksQuery,
    useUnblockMutation,
} = blockApi;
