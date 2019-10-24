module.exports = ({ authService }) => {
  
    return {
      jwtAuthz: (expectedScopes = []) => async (ctx, next) => {
        let token = null;
        if (ctx.headers.authorization) {
          const authorization = ctx.headers.authorization.split(' ');
          token = authorization.length > 1 ? authorization[1] : authorization[0];
        } else {
          token = ctx.query.accessToken;
        }
  
        if (!token) {
            ctx.status = 401;
            ctx.body = { message: 'Missing authorization token' };
            return ctx;
        }

        try {
            ctx.token = await authService.verifyJWT(token, expectedScopes);    
            return next();
        } catch (e) {
            const { message } = e;
            if (message === 'Invalid or expired token') {
                ctx.status = 401;
                ctx.body = { message };
                return ctx;                
            }
            if (message === 'Insufficient scope') {
                ctx.status = 403;
                ctx.body = { message };
                return ctx;                
            }
            console.log(e);
            ctx.status = 500;
            return ctx;
        }
      },
    };
  };
  