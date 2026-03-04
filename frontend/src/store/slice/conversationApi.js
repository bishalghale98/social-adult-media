import { apiSlice } from '../apiSlice';

const conversationApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getConversations: builder.query({
            query: () => ({ url: '/conversations' }),
            providesTags: ['Conversations'],
        }),

        getMessages: builder.query({
            query: (conversationId) => ({ url: `/conversations/${conversationId}/messages` }),
            providesTags: (result, error, conversationId) => [{ type: 'Messages', id: conversationId }],
        }),
    }),
    overrideExisting: false,
});

export const {
    useGetConversationsQuery,
    useGetMessagesQuery,
} = conversationApi;
