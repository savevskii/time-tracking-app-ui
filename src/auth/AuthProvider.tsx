import { useEffect, useRef, useState, type ReactNode } from 'react';
import keycloak from "@/auth/keycloak";
import { AuthContext, type AuthContextType } from '@/auth/AuthContext';
import type { Role, TokenParsedMinimal } from '@/types';
import { extractRoles } from '@/auth/roles';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [token, setToken] = useState<string | undefined>(undefined);
    const [roles, setRoles] = useState<Role[]>([]);
    const hasInitialized = useRef(false);

    useEffect(() => {
        if (!hasInitialized.current) {
            hasInitialized.current = true;

            keycloak
                .init({ onLoad: 'login-required' })
                .then((authenticated) => {
                    if (authenticated) {
                        setIsAuthenticated(true);
                        setToken(keycloak.token);
                        setRoles(extractRoles(keycloak.tokenParsed as TokenParsedMinimal));
                    }
                })
                .catch((err) => console.error('Keycloak init failed', err));
        }
    }, []);

    const hasRole = (role: Role) => roles.includes(role);
    const isAdmin = hasRole('admin');

    const logout = () => keycloak.logout();

    const value: AuthContextType = {
        isAuthenticated,
        token,
        roles,
        hasRole,
        isAdmin,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
