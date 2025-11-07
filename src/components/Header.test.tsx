import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Header from './Header';
import type { Role } from '@/types';

const mockAuth = {
    isAuthenticated: false,
    isAdmin: false,
    roles: [] as Role[],
    logout: vi.fn(),
};

vi.mock('@/hooks/useAuth', () => ({
    default: () => mockAuth,
}));

const renderHeader = () =>
    render(
        <MemoryRouter>
            <Header />
        </MemoryRouter>
    );

describe('Header', () => {
    beforeEach(() => {
        mockAuth.isAuthenticated = false;
        mockAuth.isAdmin = false;
        mockAuth.roles = [];
        mockAuth.logout = vi.fn();
    });

    it('shows only public links when user is not authenticated', () => {
        renderHeader();

        expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
        expect(screen.queryByRole('link', { name: /time entries/i })).not.toBeInTheDocument();
        expect(screen.queryByRole('link', { name: /dashboard/i })).not.toBeInTheDocument();
        expect(screen.queryByRole('link', { name: /projects/i })).not.toBeInTheDocument();
        expect(screen.queryByRole('button', { name: /logout/i })).not.toBeInTheDocument();
    });

    it('shows time entries and logout when authenticated regular user', () => {
        mockAuth.isAuthenticated = true;

        renderHeader();

        expect(screen.getByRole('link', { name: /time entries/i })).toBeInTheDocument();
        expect(screen.queryByRole('link', { name: /dashboard/i })).not.toBeInTheDocument();
        expect(screen.queryByRole('link', { name: /projects/i })).not.toBeInTheDocument();
        expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
    });

    it('shows admin links and triggers logout when clicked', async () => {
        const user = userEvent.setup();
        mockAuth.isAuthenticated = true;
        mockAuth.isAdmin = true;

        renderHeader();

        expect(screen.getByRole('link', { name: /dashboard/i })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /projects/i })).toBeInTheDocument();

        await user.click(screen.getByRole('button', { name: /logout/i }));
        expect(mockAuth.logout).toHaveBeenCalledTimes(1);
    });
});
