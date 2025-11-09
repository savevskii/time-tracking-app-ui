import '@testing-library/jest-dom/vitest';
import { server } from '@/mocks/server';
import { resetProjects, resetDashboard } from '@/mocks/handlers';
import { vi } from 'vitest';
import { keycloakMock, resetKeycloakMock } from './keycloak.mock';
import ResizeObserver from 'resize-observer-polyfill';

const defaultConfig = {
    keycloakUrl: 'http://localhost:8080',
    keycloakRealm: 'dev',
    keycloakClientId: 'time-tracking-app',
    apiBaseUrl: 'http://localhost:9191',
};

if (typeof window !== 'undefined') {
    window.__APP_CONFIG__ = defaultConfig;
}

const chartRect = {
    width: 800,
    height: 400,
    top: 0,
    left: 0,
    bottom: 400,
    right: 800,
    x: 0,
    y: 0,
    toJSON() {
        return this;
    },
};

const getBoundingClientRectSpy = vi
    .spyOn(HTMLElement.prototype, 'getBoundingClientRect')
    .mockImplementation(() => chartRect);

const originalClientWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'clientWidth');
const originalClientHeight = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'clientHeight');
const originalOffsetWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetWidth');
const originalOffsetHeight = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetHeight');

Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
    configurable: true,
    value: 800,
});
Object.defineProperty(HTMLElement.prototype, 'clientHeight', {
    configurable: true,
    value: 400,
});
Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
    configurable: true,
    value: 800,
});
Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
    configurable: true,
    value: 400,
});

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => {
    server.resetHandlers();
    resetProjects();
    resetDashboard();
    resetKeycloakMock();
});
afterAll(() => {
    server.close();
    getBoundingClientRectSpy.mockRestore();
    if (originalClientWidth) Object.defineProperty(HTMLElement.prototype, 'clientWidth', originalClientWidth);
    if (originalClientHeight) Object.defineProperty(HTMLElement.prototype, 'clientHeight', originalClientHeight);
    if (originalOffsetWidth) Object.defineProperty(HTMLElement.prototype, 'offsetWidth', originalOffsetWidth);
    if (originalOffsetHeight) Object.defineProperty(HTMLElement.prototype, 'offsetHeight', originalOffsetHeight);
});

// Mock Keycloak
vi.mock('@/auth/keycloak', () => ({ default: keycloakMock }));

// --- Polyfill ResizeObserver for Recharts ---
vi.stubGlobal('ResizeObserver', ResizeObserver as unknown as typeof globalThis.ResizeObserver);
