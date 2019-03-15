// @ts-check
/** @module */
const nforce = require('nforce')
const envCreate = require('env-create')
const logger = require('./util/logger')

class Salesforce {
  /**
 * Create the TrelloPLus class to add more trello functions
 * @param {?string} pathString path to the trello JSON credentials file
 */

  constructor(pathString) {
    const param = {}
    if (pathString !== undefined) {
      param.path = pathString
    }
    const result = envCreate(param)
    if (result.status === false) {
      const errorMsg = `FATAL ERROR reading credentials. ${JSON.stringify(result, null, 2)}`
      logger.error(errorMsg)
      throw (errorMsg)
    }
    const sfAuth = JSON.parse(process.env.sfHelperDev)
    this.clientId = sfAuth.clientId
    this.clientSecret = sfAuth.clientSecret
    this.username = sfAuth.username
    this.password = sfAuth.password
  }

  createConnection() {
    // can also have
    // apiVersion: 'v45.0'
    // environment: 'production' //or 'sandbox'
    this.org = nforce.createConnection({
      clientId: this.clientId,
      clientSecret: this.clientSecret,
      redirectUri: 'http://localhost:3000/oauth/callback',
      mode: 'single',
    })

    this.org.authenticate({username: this.username, password: this.password}, function (err, resp) {
      // the oauth object was stored in the connection object
      if (!err) {console.log(`Cached Token:  ${this.org.oauth.access_token}`)}
    })

  }

  getAccounts() {
    this.org._apiAuthRequest
  }

}

