module.exports = {
    host: 'http://localhost',
    port: 3001,
    insurance: {
        host: 'https://www.mocky.io/v2',
        policiesPath: '/580891a4100000e8242b75c5',
        clientsPath: '/5808862710000087232b75ac',      
    },
    auth: {
        issuer: 'insurance:api:dev',
        audience: 'insurance:api:dev',
        ttl: 7200,
    }
};
  