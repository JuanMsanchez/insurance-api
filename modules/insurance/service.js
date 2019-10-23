const fetch = require('node-fetch');

module.exports = ({ config, cache }) => {
    const { host, policiesPath, clientsPath } = config.get('insurance');

    const CACHE_POLICIES_KEY = 'policies';
    const CACHE_CLIENTS_KEY = 'clients';
    
    return {
        cache: cache,
        constants : { CACHE_CLIENTS_KEY, CACHE_POLICIES_KEY },

        async getPolicies(filters = {}) {
            const cachedPolicies = cache.get(CACHE_POLICIES_KEY);
            let policies = cachedPolicies ? 
                cachedPolicies : await this.fetchPoliciesFromSource();
            if (!cachedPolicies) cache.set(CACHE_POLICIES_KEY, policies);

            const { username } = filters;
            if ( username ) {
                const clients = await this.getClients() || [];
                const client = clients.find(c => c.name.toLowerCase() === username.toLowerCase());
                policies = client ? policies.filter(p => p.clientId === client.id) : [];
            }

            return policies;
        },

        async getClients() {
            const cachedClients = cache.get(CACHE_CLIENTS_KEY);
            const clients = cachedClients ? 
                cachedClients : await this.fetchClientsFromSource();
            if (!cachedClients) cache.set(CACHE_CLIENTS_KEY, clients);
            return clients;
        },

        async fetchPoliciesFromSource() {                       
            const response = await fetch(`${host}${policiesPath}`);
            if (response.status !== 200) {
                throw new Error('Policies service not availbale');
            }
            const { policies } = await response.json();
            return policies;
        },

        async fetchClientsFromSource(fromCache = true) {
            const response = await fetch(`${host}${clientsPath}`);
            if (response.status !== 200) {
                throw new Error('Clients service not availbale');
            }
            const { clients } = await response.json();
            return clients;
        }

    }
};