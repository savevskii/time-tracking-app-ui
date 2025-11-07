import { render } from '@testing-library/react';
import useAuth from './useAuth';
import { AuthContext, type AuthContextType } from '@/auth/AuthContext';

const TestConsumer = ({ onUse }: { onUse: (auth: AuthContextType) => void }) => {
    const auth = useAuth();
    onUse(auth);
    return <div>ok</div>;
};

describe('useAuth', () => {
    it('throws when used outside of AuthProvider', () => {
        const onUse = vi.fn();
        expect(() =>
            render(<TestConsumer onUse={onUse} />)
        ).toThrowError('useAuth must be used within <AuthProvider>');
        expect(onUse).not.toHaveBeenCalled();
    });

    it('returns the auth context when provider is present', () => {
        const contextValue: AuthContextType = {
            isAuthenticated: true,
            token: 'token',
            roles: ['admin'],
            hasRole: vi.fn(),
            isAdmin: true,
            logout: vi.fn(),
        };
        const onUse = vi.fn();

        render(
            <AuthContext.Provider value={contextValue}>
                <TestConsumer onUse={onUse} />
            </AuthContext.Provider>
        );

        expect(onUse).toHaveBeenCalledWith(contextValue);
    });
});
