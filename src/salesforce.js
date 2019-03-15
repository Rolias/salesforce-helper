// @ts-check
/** @module */
const nforce = require('nforce')
const envCreate = require('env-create')
const logger = require('./util/logger')
const {stringify} = require('./util/helper')
/** @class */
class Salesforce {
  /**
 * Create the TrelloPLus class to add more trello functions
 * @param {?string} pathString path to the trello JSON credentials file
 */

  constructor(pathStringToCreds) {
    const credType = ()
    const param = {}
    if (pathStringToCreds !== undefined) {
      param.path = pathStringToCreds
    }
    const result = envCreate.load(param)
    if (result.status === false) {
      const errorMsg = `FATAL ERROR reading credentials. ${stringify(result)}`
      logger.error(errorMsg)
      throw (errorMsg)
    }

    const sfAuth = JSON.parse(process.env.sfHelperDev)

    this.clientId = sfAuth.clientId
    this.clientSecret = sfAuth.clientSecret

    this.authObj = {
      username: sfAuth.username,
      password: sfAuth.password,
      securityToken: sfAuth.securityToken,
    }
    console.log(this.authObj)

  }

  /**
   * 
   * @param {string} pathStringToCreds 
   * @returns{Promise<{Salesforce}>}
   */
  static async create(pathStringToCreds) {
    const instance = new Salesforce(pathStringToCreds)
    instance.createConnection()
    await instance.authenticate()
    return instance
  }


  /** Do the authentication steps. Since it's asynchronous I didn't want
   * it as part of the constructor. 
  */
  async init() {
    this.createConnection()
    return await this.authenticate()
  }

  createConnection() {
    // can also have
    // apiVersion: 'v45.0'
    // environment: 'production' //or 'sandbox'
    this.org = nforce.createConnection({
      clientId: this.clientId,
      clientSecret: this.clientSecret,
      redirectUri: 'http://localhost:3000/oauth/callback',
      environment: 'production',
      mode: 'single',
    })
  }

  authenticate() {
    return new Promise((resolve, reject) => {
      this.org.authenticate(this.authObj, (error, response) => {
        if (!error) {
          console.log("Authenticated")
          resolve(response)
        } else {
          reject(error)
        }
      })
    })
  }

  /**
 * Perform a SOQL Query
 * @param {string} queryString - SOQL query
 * @example query('SELECT ID, Name FROM Account LIMIT 10')
 */
  query(queryString) {
    console.log("doing the query")
    return new Promise((resolve, reject) => {
      this.org.query(
        {
          query: queryString,
        },
        (error, response) => {
          if (!error) {
            console.log("Query finished")
            resolve(response.records)
          } else {
            console.log("Error")
            reject(error)
          }
        }
      )
    })
  }

  async sampleQuery() {
    const result = await this.query('SELECT ID, Name FROM Account LIMIT 10')
    logger.info(result)
    return result
  }

}

module.exports = Salesforce
