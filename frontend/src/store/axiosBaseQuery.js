import api from '../lib/api';

/**
 * Custom base query that delegates to our existing Axios instance.
 * This preserves all interceptors (token attach, refresh, etc.).
 */
const axiosBaseQuery = () => async ({ url, method = 'GET', data, params, headers }) => {
    try {
        const result = await api({
            url,
            method,
            data,
            params,
            headers,
        });
        return { data: result.data };
    } catch (axiosError) {
        const err = axiosError;
        return {
            error: {
                status: err.response?.status,
                data: err.response?.data || err.message,
            },
        };
    }
};

export default axiosBaseQuery;
