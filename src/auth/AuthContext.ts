import { createContext } from 'react';
import type { Role } from '@/types';

export interface AuthContextType {
    isAuthenticated: boolean;
    token?: string;
    roles: Role[];
    hasRole: (role: Role) => boolean;
    isAdmin: boolean;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
