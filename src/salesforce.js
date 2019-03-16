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

  constructor(param) {
    const credType = (param && param.type) || Salesforce.CRED_TYPE.PRODUCTION
    const path = (param && {path: param.path}) || {}

    const result = envCreate.load(path)
    if (result.status === false) {
      const errorMsg = `FATAL ERROR reading credentials. ${stringify(result)}`
      logger.error(errorMsg)
      throw (errorMsg)
    }
    const sfAuth = credType === Salesforce.CRED_TYPE.PRODUCTION ? JSON.parse(process.env.sfHelperProduction)
      : JSON.parse(process.env.sfHelperDevelopment)

    this.clientId = sfAuth.clientId
    this.clientSecret = sfAuth.clientSecret

    this.authObj = {
      username: sfAuth.username,
      password: sfAuth.password,
      securityToken: sfAuth.securityToken,
    }

  }

  /**
   * 
   * @param {{path,type}} param  
   * @returns{Promise<{Salesforce}>}
   */
  static async create(param) {
    const instance = new Salesforce(param)
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
          resolve(response)
        } else {
          reject(error)
        }
      })
    })
  }

  /**
  * Perform a SOQL Query
  * @param {string} queryString - SOQL query string
  * @example query('SELECT ID, Name FROM Account LIMIT 10')
  */
  query(queryString) {
    return new Promise((resolve, reject) => {
      this.org.query(
        {
          query: queryString,
        },
        (error, response) => {
          if (!error) {
            resolve(response.records)
          } else {
            reject(error)
          }
        }
      )
    })
  }

  /**
   * Gets the payment amount, published date and play by play pub amount for the given course id
   * @param {string} courseId 
   * returns {Promise<Object>}
   */
  async getCourseFinanceInfo(courseId) {
    const fields = 'Completion_Payment_Amount__c, Published_Date__c, Play_by_Play_Publication_Amount__c '
    const fromClause = `from Opportunity where Course_ID__c = '${courseId}'`
    const queryString = `Select ${fields} ${fromClause}`
    return this.query(queryString)
  }
}

Salesforce.CRED_TYPE = {
  PRODUCTION: 1,
  DEVELOPMENT: 2,
}

module.exports = Salesforce
