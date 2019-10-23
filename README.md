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


## Test
Tests are implemented with [Jest](https://jestjs.io/en/)
```
npm test
```