import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import type { Role } from '@/types';

const mockAuthState = {
    isAuthenticated: false,
    roles: [] as Role[],
};

vi.mock('@/hooks/useAuth', () => ({
    default: () => mockAuthState,
}));

const renderRoute = (node: ReactNode) => {
    return render(
        <MemoryRouter initialEntries={['/secure']}>
            <Routes>
                <Route path="/" element={<div>Public</div>} />
                <Route path="/not-authorized" element={<div>Denied</div>} />
                <Route path="/secure" element={node} />
            </Routes>
        </MemoryRouter>
    );
};

describe('PrivateRoute', () => {
    beforeEach(() => {
        mockAuthState.isAuthenticated = false;
        mockAuthState.roles = [];
    });

    it('redirects to home when user is not authenticated', () => {
        renderRoute(
            <PrivateRoute>
                <div>Secret</div>
            </PrivateRoute>
        );

        expect(screen.getByText('Public')).toBeInTheDocument();
    });

    it('redirects to not authorized when role is missing', () => {
        mockAuthState.isAuthenticated = true;

        renderRoute(
            <PrivateRoute allowedRoles={['admin']}>
                <div>Secret</div>
            </PrivateRoute>
        );

        expect(screen.getByText('Denied')).toBeInTheDocument();
    });

    it('renders children when authenticated and role matches', () => {
        mockAuthState.isAuthenticated = true;
        mockAuthState.roles = ['admin'];

        renderRoute(
            <PrivateRoute allowedRoles={['admin']}>
                <div>Secret</div>
            </PrivateRoute>
        );

        expect(screen.getByText('Secret')).toBeInTheDocument();
    });
});
