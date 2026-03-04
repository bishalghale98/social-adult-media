import { createApi } from '@reduxjs/toolkit/query/react';
import axiosBaseQuery from './axiosBaseQuery';

/**
 * Base API slice — all domain-specific endpoints are injected
 * from separate files using apiSlice.injectEndpoints().
 */
export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: axiosBaseQuery(),
    tagTypes: [
        'Me',
        'Users',
        'IncomingRequests',
        'OutgoingRequests',
        'Conversations',
        'Messages',
        'Blocks',
        'Reports',
    ],
    endpoints: () => ({}),
});
