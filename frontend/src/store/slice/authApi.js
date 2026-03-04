import { apiSlice } from '../apiSlice';

const authApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getMe: builder.query({
            query: () => ({ url: '/me' }),
            providesTags: ['Me'],
        }),

        login: builder.mutation({
            query: (credentials) => ({ url: '/auth/login', method: 'POST', data: credentials }),
            invalidatesTags: ['Me'],
        }),

        register: builder.mutation({
            query: (formData) => ({ url: '/auth/register', method: 'POST', data: formData }),
            invalidatesTags: ['Me'],
        }),

        logout: builder.mutation({
            query: () => ({ url: '/auth/logout', method: 'POST' }),
            invalidatesTags: ['Me'],
        }),

        acceptConsent: builder.mutation({
            query: () => ({ url: '/auth/consent/accept', method: 'POST' }),
            invalidatesTags: ['Me'],
        }),
    }),
    overrideExisting: false,
});

export const {
    useGetMeQuery,
    useLoginMutation,
    useRegisterMutation,
    useLogoutMutation,
    useAcceptConsentMutation,
} = authApi;
