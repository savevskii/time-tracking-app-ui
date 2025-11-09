import axios from 'axios';
import keycloak from '@/auth/keycloak';
import { getRuntimeConfig } from '@/lib/runtimeConfig';

const resolveApiBaseUrl = () => {
    if (typeof window === 'undefined') {
        return '';
    }
    const { apiBaseUrl } = getRuntimeConfig();
    return apiBaseUrl;
};

const api = axios.create({
    baseURL: resolveApiBaseUrl(),
    headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
    if (!config.baseURL) {
        config.baseURL = resolveApiBaseUrl();
    }
    if (keycloak?.authenticated && keycloak.token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${keycloak.token}`;
    }
    return config;
});

export default api;
