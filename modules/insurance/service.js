const fetch = require('node-fetch');

module.exports = ({ config }) => {
    const { host, policiesPath, clientsPath } = config.get('insurance');

    return {

        async getPolicies() {
            const response = await fetch(`${host}${policiesPath}`, { rejectUnauthorized: true });
            if (response.status !== 200) {
                throw new Error('Policies service not availbale');
            }
            const { policies } = await response.json();
            return policies;
        },

        async getClients() {
            const response = await fetch(`${host}${clientsPath}`);
            if (response.status !== 200) {
                throw new Error('Clients service not availbale');
            }
            const { clients } = await response.json();
            return clients;
        }


    }
};