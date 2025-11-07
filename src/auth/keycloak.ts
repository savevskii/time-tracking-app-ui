import Keycloak from 'keycloak-js';
import { getRuntimeConfig } from '@/lib/runtimeConfig';

const { keycloakUrl, keycloakRealm, keycloakClientId } = getRuntimeConfig();

const keycloak = new Keycloak({
    url: keycloakUrl,
    realm: keycloakRealm,
    clientId: keycloakClientId,
});

export default keycloak;
