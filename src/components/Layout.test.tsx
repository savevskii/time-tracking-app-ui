import { render, screen } from '@testing-library/react';
import Layout from './Layout';

vi.mock('@/components/Header', () => ({
    default: () => <div data-testid="header-stub">Header</div>,
}));

describe('Layout', () => {
    it('renders the header and children content', () => {
        render(
            <Layout>
                <p>Child content</p>
            </Layout>
        );

        expect(screen.getByTestId('header-stub')).toBeInTheDocument();
        expect(screen.getByText('Child content')).toBeInTheDocument();
    });
});
