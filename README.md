# Insurnace API
Manage insurance information

#### Requirements:
- Get user data filtered by user id -> accesible by "user" and "admin" roles
- Get user data filtered by user name -> accesible by "user" and "admin" roles
- Get list of policies linked to an user name -> accesible by "admin" role
- Get the user linked to a policy number -> accesible by "admin" role 

#### External resources
- [Company clients](https://www.mocky.io/v2/5808862710000087232b75ac) 
- [Company policies](https://www.mocky.io/v2/580891a4100000e8242b75c5)

#### Authentication & Authorization
Since we don't have passwords for our users I decided to take on a passwordless / invitation 
approach using JWT tokens.
Ideally the invitation tokens should be sent directly to the user inbox and then exchanged for a propper acces token, but for the sake of simplicity we will be returning the JWT tokens on a REST endpoint.

I've chosen to use a RSA asymetric key for signing a verifying the JWT. The key is currently being generated at runtime and ketp in memory, the problem with this approach is that the tokens will only be valid for the same instance that originally emited the token.
In a real world scenario we could have a stored key and then share the public part through a REST endpoint so other services could validate the JWTs.

#### Cache layer & Database
I added `node-cache` in replacement of Redis, which would give us better cache support through all the nodes.

#### Notes
I tracked the .env file for setting up the `NODE_TLS_REJECT_UNAUTHORIZED` environment variable.
Please keep in mind that `NODE_TLS_REJECT_UNAUTHORIZED` is set just for testing purpouses.

## Installation
requires __node v10.16.3__ or higher.
```
git clone https://gitlab.com/invad3r/insurance-api
cd insurance-api/
npm install
npm start
```

## REST Modules
| Module name        | Description                              | Base path               |
| ------------------ | ---------------------------------------- | ----------------------- |
| status             | returns the API status and uptime        | /status                 |
| swagger            | provides swagger doc for all endpoints   | /swagger                |
| invitation         | insurance rest module                    | /insurance/*            |

## Test
Tests are implemented with [Jest](https://jestjs.io/en/)
```
npm test
```