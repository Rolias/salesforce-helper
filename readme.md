# Salesforce Helper

## Installation

`npm install salesforce-helper`

## Usage


```javascript
const Sf = require('salesforce-helper')
const usage = async ()=>{
  const salesforce =  await Sf().create('pathToCredentialsFile')
  const result = await salesforce.query('SELECT ID, Name FROM Account LIMIT 10')
}
usage()
```

Alternately, you can `new` up an instance in one step and later do the asynchronous authentication
via a call to `init()`. The above `create()` call does this under the hood.

```javascript
 const Sf = require('salesforce-helper')
 const salesforce = new Sf('pathToCredentialsFile')

 const usage = async() =>{
   await salesforce.init()
   const result = await salesforce.query('SELECT ID, Name FROM Account LIMIT 10')
 }


```
