const Router = require('koa-router');

module.exports = ({ insuranceService }) => {
    const router = new Router();

    router.get('/insurance/token', async (ctx, next) => {
        const { email } = ctx.query;
        let token;

        if (!/\S+@\S+\.\S+/.test(email))
            return ctx.badRequest({ message: 'Invalid or missing email param' });

        try {
            token = await insuranceService.getAccessToken(email);
        } catch (e) {
            if(e.message === 'Invalid user')
                return ctx.badRequest({ message: 'Invalid user' });

            console.log(e);
            return ctx.internalServerError();
        }

        return ctx.ok({ token });
    });
    
    return router.routes();
}