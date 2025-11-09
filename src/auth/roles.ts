import type { Role, TokenParsedMinimal } from '@/types';

const KNOWN_ROLES: Role[] = ['admin', 'user'];

export const extractRoles = (tokenParsed?: TokenParsedMinimal): Role[] => {
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
};
