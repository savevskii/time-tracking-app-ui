import { useEffect, useRef, useState, type ReactNode } from 'react';
import keycloak from "@/auth/keycloak";
import { AuthContext, type AuthContextType } from '@/auth/AuthContext';
import type { Role, TokenParsedMinimal } from '@/types';

const KNOWN_ROLES: Role[] = ['admin', 'user'];

export function extractRoles(tokenParsed?: TokenParsedMinimal): Role[] {
    if (!tokenParsed) return [];

    const realmRoles = tokenParsed.realm_access?.roles ?? [];
    const resourceRoles = Object.values(tokenParsed.resource_access ?? {}).flatMap((entry) => entry.roles ?? []);
    const normalized = new Set<Role>();

    [...realmRoles, ...resourceRoles].forEach((role) => {
        if (!role) return;
        const value = role.toLowerCase();
        if (KNOWN_ROLES.includes(value as Role)) {
            normalized.add(value as Role);
        }
    });

    return Array.from(normalized);
}

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
