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
    this.credType = (param && param.type) || Salesforce.CRED_TYPE.PRODUCTION
    const path = (param && {path: param.path}) || {}

    const result = envCreate.load(path)
    if (result.status === false) {
      const errorMsg = `FATAL ERROR reading credentials. ${stringify(result)}`
      logger.error(errorMsg)
      throw (errorMsg)
    }

    const sfAuth = this.credType === Salesforce.CRED_TYPE.PRODUCTION ?
      JSON.parse(process.env.sfHelperProduction) :
      JSON.parse(process.env.sfHelperDevelopment)

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

  createConnection() {
    // can also have
    // apiVersion: 'v45.0'
    // environment: 'production' //or 'sandbox'
    this.org = nforce.createConnection({
      clientId: this.clientId,
      clientSecret: this.clientSecret,
      redirectUri: 'http://localhost:3000/oauth/callback',
      environment: 'production', // Salesforce.CRED_TYPE.getType(this.credType),
      mode: 'single',
    })
  }

  /**
   * @returns {Promise}
   */
  async authenticate() {
    return this.org.authenticate(this.authObj)
  }

  /**
  * Perform a SOQL Query
  * @param {string} queryString - SOQL query string
  * @example query('SELECT ID, Name FROM Account LIMIT 10')
  */
  async query(queryString) {
    return await this.org.query({query: queryString})
  }

  /**
 * Update a record
 * @param {{sObjectName:string, recordDataWithId:object}} param 
 */
  async updateRecord(param) {
    const sobject = nforce.createSObject(param.sObjectName, param.recordDataWithId)
    return await this.org.update({sobject})
  }

  /**
   * Insert a new record on the specified sObject 
   * @param {{sObjectName:string, recordData:object}} param  
   * @returns {Promise<Object>} - the created record
   * @example let account = createRecord('Account',{Name:'new name',Phone:'800-555-1212'})
   */
  async insertRecord(param) {
    const sobject = nforce.createSObject(param.sObjectName, param.recordData)
    return await this.org.insert({sobject})
  }

  /**
   * 
   * @param {{sObjectName:string,recordDataWithId:object}} param 
   */
  async upsertRecord(param) {
    const {recordDataWithId} = param
    let sobject = nforce.createSObject(param.sObjectName)
    const recordId = recordDataWithId.id ? recordDataWithId.id : ''
    sobject.setExternalId('Id', recordId)
    // sobject = Object.assign(sobject, recordDataWithId)
    sobject = {...sobject, ...recordDataWithId}
    return await this.org.upsert({sobject, requestOpts: {method: !recordId ? 'POST' : 'PATCH'}})
  }


  async deleteRecord(param) {
    const sobject = nforce.createSObject(param.sObjectName, param.recordDataWithId)
    return await this.org.delete({sobject})
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
  properties: {
    1: {type: 'production'},
    2: {type: 'development'},
  },
  getType: (value) => Salesforce.CRED_TYPE.properties[value].type,
}


module.exports = Salesforce
