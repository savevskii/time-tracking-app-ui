import { describe, it, expect } from 'vitest';
import { extractRoles } from './roles';
import type { TokenParsedMinimal } from '@/types';

describe('extractRoles', () => {
    it('returns empty array when token is missing', () => {
        expect(extractRoles()).toEqual([]);
    });

    it('normalizes realm roles case-insensitively', () => {
        const token: TokenParsedMinimal = {
            realm_access: {
                roles: ['ADMIN', 'user', 'other'],
            },
        };

        expect(extractRoles(token)).toEqual(['admin', 'user']);
    });

    it('falls back to resource access roles', () => {
        const token: TokenParsedMinimal = {
            resource_access: {
                frontend: { roles: ['Admin'] },
                backend: { roles: ['USER'] },
            },
        };

        expect(extractRoles(token)).toEqual(['admin', 'user']);
    });
});
