# Salesforce Helper

## Installation

`npm install salesforce-helper`

## Usage

The simplest possible way, which looks for production credentials in .env.json  
You can find out more about credentials in the [[Authentication]] section
```javascript
const Sf = require('salesforce-helper')
const usage = async ()=>{
  const salesforce =  await Sf().create() // default to .env.json and production credentials
  const result = await salesforce.query('SELECT ID, Name FROM Account LIMIT 10')
}
usage()
```

A more detailed example for the create() parameter 

``` javascript
const Sf = require('salesforce-helper')
const usage = async ()=>{
  const salesforce =  await Sf().create({path:'pathtocredentials',type:Sf.PRODUCTION}) 
  const result = await salesforce.query('SELECT ID, Name FROM Account LIMIT 10')
}
usage()
```

Alternately, you can `new` up an instance in one step and later do the asynchronous authentication
via a call to `init()`. The above `create()` call does this under the hood.

```javascript
 const Sf = require('salesforce-helper')
 const salesforce = new Sf(path:'somePath',type:Sf.CRED_TYPE.DEVELOPMENT)

 const usage = async() =>{
   await salesforce.init()
   const result = await salesforce.query('SELECT ID, Name FROM Account LIMIT 10')
 }
```

## Authentication

The librarly expects to find a .json file either in .env.json or at the file specified. You can store a set of production and development credentials in that file. It should have the following form:

```JSON
{
  "sfHelperProduction": {
    "securityToken": "longsalphanumeric",
    "clientId": "longalphanumeric",
    "clientSecret": "longalphanumeric",,
    "username": "sf username",
    "password": "sf password"
  },
  "sfHelperDevelopment": {
    "securityToken": "longsalphanumeric",
    "clientId": "longalphanumeric",
    "clientSecret": "longalphanumeric",,
    "username": "sf username",
    "password": "sf password"
  }
}

The Salesforce class has a static enum property named `CRED_TYPE` with values for `PRODUCTION` and `DEVELOPMENT, that allows you to select which set of credentials will be used.  

```

## Integration Tests

This project contains integration tests which are fragile. You will likely need to modify those. This is a good use for the the `CRED_TYPE.DEVELOPMENT` credentials. You can set up a free Salesforce Developer org and have deterministic data you can run the unit tests against. The normal `npm test` runs just the ounit tests. `npm run test:int` will run the integration tests. Integration tests have a suffix of `.test.int.js` unit tests use `.test.js`