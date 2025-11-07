import type { AppRuntimeConfig } from '@/types';

declare global {
    interface Window {
        __APP_CONFIG__?: AppRuntimeConfig;
    }
}

let cachedConfig: AppRuntimeConfig | null = null;

export const getRuntimeConfig = (): AppRuntimeConfig => {
    if (cachedConfig) {
        return cachedConfig;
    }

    if (!window.__APP_CONFIG__) {
        throw new Error('Runtime configuration is missing (window.__APP_CONFIG__ is undefined).');
    }

    cachedConfig = window.__APP_CONFIG__;
    return cachedConfig;
};
