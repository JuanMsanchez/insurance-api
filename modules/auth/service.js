const { JWT } = require('@panva/jose');

module.exports = ({ key, config }) => {
    return {
        getJWT(uuid, scope) {
            const { ttl, audience, issuer } = config.get('auth');
            const issued = Math.round(new Date().getTime() / 1000);
            const expiration = issued + ttl;
      
            const payload = {
              sub: uuid,
              iss: issuer,
              iat: issued,
              exp: expiration,
              aud: audience,
              scope: scope,
            };
      
            const signedToken = JWT.sign(payload, key);
            return signedToken;
        },

        verifyJWT (token, expectedScopes = []) {
            let decoded;

            // validate token signature
            try {
                const isValid = JWT.verify(token, key);
                decoded = JWT.decode(token);
            } catch (e) {
                throw new Error(`Invalid or expired token`);
            }

            // validate token scope
            if (expectedScopes.length) {
                const allowed = expectedScopes.some(e => decoded.scope.includes(e));
                if (!allowed) throw new Error('Insufficient scope');
            }

            return decoded;
        },
    }
};


