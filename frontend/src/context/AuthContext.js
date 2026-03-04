'use client';
import { createContext, useContext } from 'react';
import { useRouter } from 'next/navigation';
import {
    useGetMeQuery,
    useLoginMutation,
    useRegisterMutation,
    useLogoutMutation,
    useAcceptConsentMutation,
} from '../store/slice/authApi';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const router = useRouter();

    // RTK Query handles fetching + caching the current user
    const { data: user = null, isLoading: loading, refetch: checkAuth } = useGetMeQuery(undefined, {
        // Skip the query if there's no token (avoids a 401 on first load)
        skip: typeof window !== 'undefined' && !localStorage.getItem('accessToken'),
    });

    const [loginMutation] = useLoginMutation();
    const [registerMutation] = useRegisterMutation();
    const [logoutMutation] = useLogoutMutation();
    const [acceptConsentMutation] = useAcceptConsentMutation();

    async function login(email, password) {
        const { data } = await loginMutation({ email, password }).unwrap().then((data) => ({ data }));
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        // Check consent
        if (!data.user.consentAcceptedAt) {
            router.push('/consent');
        } else {
            router.push('/app/discover');
        }
        return data;
    }

    async function register(formData) {
        const data = await registerMutation(formData).unwrap();
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        router.push('/consent');
        return data;
    }

    async function logout() {
        try {
            await logoutMutation().unwrap();
        } catch {
            // Ignore
        }
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        router.push('/auth/login');
    }

    async function acceptConsent() {
        await acceptConsentMutation().unwrap();
        router.push('/app/discover');
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, acceptConsent, checkAuth }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
}
