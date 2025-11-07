import type { ReactElement, ReactNode } from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '@/auth/AuthProvider';

type RenderOptions = {
    route?: string;
    withAuthProvider?: boolean;
};

// Minimal provider wrapper; add more providers as your app grows
export function renderWithProviders(ui: ReactElement, options: RenderOptions = {}) {
    const { route = '/', withAuthProvider = true } = options;
    const tree: ReactNode = <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>;
    return render(withAuthProvider ? <AuthProvider>{tree}</AuthProvider> : tree);
}
