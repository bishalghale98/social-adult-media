import { apiSlice } from '../apiSlice';

const friendApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        sendFriendRequest: builder.mutation({
            query: ({ receiverId }) => ({
                url: '/friends/requests',
                method: 'POST',
                // if you're using axiosBaseQuery, keep `data`
                data: { receiverId },
                // if you're using fetchBaseQuery, replace with:
                // body: { receiverId },
            }),

            // optimistic: remove user from discover list
            async onQueryStarted({ receiverId, queryParams }, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    apiSlice.util.updateQueryData('getUsers', queryParams, (draft) => {
                        if (draft?.users) {
                            draft.users = draft.users.filter((u) => u.userId !== receiverId);
                        }
                    })
                );

                try {
                    await queryFulfilled;

                    // ✅ ensure latest state: refetch outgoing (and incoming if your backend changes it)
                    dispatch(
                        friendApi.endpoints.getOutgoingRequests.initiate(undefined, {
                            forceRefetch: true,
                            subscribe: false,
                        })
                    );

                    // optional: only if you want to refresh incoming too
                    dispatch(
                      friendApi.endpoints.getIncomingRequests.initiate(undefined, {
                        forceRefetch: true,
                        subscribe: false,
                      })
                    );
                } catch {
                    patchResult.undo();
                }
            },

            // ✅ this will trigger refetch for any mounted query using these tags
            invalidatesTags: ['OutgoingRequests'],
        }),

        getIncomingRequests: builder.query({
            query: () => ({ url: '/friends/requests/incoming' }),
            providesTags: ['IncomingRequests'],
        }),

        getOutgoingRequests: builder.query({
            query: () => ({ url: '/friends/requests/outgoing' }),
            providesTags: ['OutgoingRequests'],
        }),

        acceptRequest: builder.mutation({
            query: (id) => ({ url: `/friends/requests/${id}/accept`, method: 'POST' }),

            async onQueryStarted(id, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    apiSlice.util.updateQueryData('getIncomingRequests', undefined, (draft) => {
                        const index = draft?.findIndex((r) => r.id === id);
                        if (index !== -1) draft.splice(index, 1);
                    })
                );

                try {
                    await queryFulfilled;

                    // ✅ ensure lists are fresh
                    dispatch(
                        friendApi.endpoints.getIncomingRequests.initiate(undefined, {
                            forceRefetch: true,
                            subscribe: false,
                        })
                    );
                    dispatch(
                        friendApi.endpoints.getOutgoingRequests.initiate(undefined, {
                            forceRefetch: true,
                            subscribe: false,
                        })
                    );
                } catch {
                    patchResult.undo();
                }
            },

            invalidatesTags: ['IncomingRequests', 'Conversations'],
        }),

        rejectRequest: builder.mutation({
            query: (id) => ({ url: `/friends/requests/${id}/reject`, method: 'POST' }),
            async onQueryStarted(id, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    apiSlice.util.updateQueryData('getIncomingRequests', undefined, (draft) => {
                        const index = draft?.findIndex((r) => r.id === id);
                        if (index !== -1) draft.splice(index, 1);
                    })
                );

                try {
                    await queryFulfilled;

                    dispatch(
                        friendApi.endpoints.getIncomingRequests.initiate(undefined, {
                            forceRefetch: true,
                            subscribe: false,
                        })
                    );
                } catch {
                    patchResult.undo();
                }
            },
            invalidatesTags: ['IncomingRequests'],
        }),

        cancelRequest: builder.mutation({
            query: (id) => ({ url: `/friends/requests/${id}/cancel`, method: 'POST' }),
            async onQueryStarted(id, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    apiSlice.util.updateQueryData('getOutgoingRequests', undefined, (draft) => {
                        const index = draft?.findIndex((r) => r.id === id);
                        if (index !== -1) draft.splice(index, 1);
                    })
                );

                try {
                    await queryFulfilled;

                    dispatch(
                        friendApi.endpoints.getOutgoingRequests.initiate(undefined, {
                            forceRefetch: true,
                            subscribe: false,
                        })
                    );
                } catch {
                    patchResult.undo();
                }
            },
            invalidatesTags: ['OutgoingRequests'],
        }),
    }),
    overrideExisting: false,
});

export const {
    useSendFriendRequestMutation,
    useGetIncomingRequestsQuery,
    useGetOutgoingRequestsQuery,
    useAcceptRequestMutation,
    useRejectRequestMutation,
    useCancelRequestMutation,
} = friendApi; 