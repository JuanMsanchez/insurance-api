const Router = require('koa-router');

module.exports = ({ insuranceService }) => {
    const router = new Router();
    
    const strValidation = new RegExp(/^[A-Z a-z 0-9-_]*$/);
    const emailValidation = new RegExp(/\S+@\S+\.\S+/);

    router.get('/insurance/token', async (ctx) => {
        const { email } = ctx.query;

        if (!emailValidation.test(email))
            return ctx.badRequest({ message: 'Invalid or missing email param' });

        try {
            const token = await insuranceService.getAccessToken(email);
            return ctx.ok({ token });
        } catch (e) {
            if(e.message === 'Invalid user')
                return ctx.badRequest({ message: 'Invalid user' });

            console.log(e);
            return ctx.internalServerError();
        }
    });
    
    router.get('/insurance/clients', async (ctx) => {
        const { policyId, name, id } = ctx.query;

        if (!(
            strValidation.test(policyId) && 
            strValidation.test(name) && 
            strValidation.test(id))
        ) {
            return ctx.badRequest({ message: 'Ilegal values on filters' });
        }

        try {
            const clients = await insuranceService.getClients({ policyId, name, id });
            return ctx.ok({ clients });
        } catch (e) {
            console.log(e);
            return ctx.internalServerError();
        }
    });
    
    router.get('/insurance/policies', async (ctx) => {
        const { username } = ctx.query;

        if (!strValidation.test(username)) {
            return ctx.badRequest({ message: 'Ilegal values on filters' });
        }

        try {
            const policies = await insuranceService.getPolicies({ username });
            return ctx.ok({ policies });
        } catch (e) {
            console.log(e);
            return ctx.internalServerError();
        }
    });
    
    return router.routes();
}