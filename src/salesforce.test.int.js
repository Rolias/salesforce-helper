// @ts-check
const chai = require('chai')
chai.should()
const logger = require('./util/logger')
const {stringify} = require('./util/helper')
const Sf = require('./salesforce')
const sampleQuery = 'SELECT ID, Name FROM Account LIMIT 10'
const sampleQuery2 = 'SELECT ID, Name, AccountNumber, phone FROM Account WHERE name LIKE \'syncor\''

const param = {
  path: '/Users/tod-gentille/dev/node/ENV_VARS/salesforce.env.json',
  type: Sf.CRED_TYPE.DEVELOPMENT,
}

/**
 * @type Sf
 */
let salesforce
const syncorAccountReset = {
  id: '0011U00000Kr3xIQAR',
  name: 'syncor',
  phone: '',
  AccountNumber: '111',
}
const syncorAccount = {
  id: '0011U00000Kr3xIQAR',
  name: 'syncor',
  phone: '800-555-1212',
  AccountNumber: '123teg',
}

// eslint-disable-next-line prefer-arrow-callback
describe('name or description of test', async function () {
  before(async () => {
    salesforce = await Sf.create(param)
    //  await salesforce.init()

  })
  this.timeout(5000)

  it('query() should get ten records back', async () => {
    const queryResult = await salesforce.query(sampleQuery)
    for (const record of queryResult.records) {
      logger.verbose(stringify(record))
    }
    queryResult.totalSize.should.equal(10)


  })

  describe('update() should', () => {
    it('put new data in the AccountNumber field', async () => {
      await salesforce.updateRecord({
        sObjectName: 'Account',
        recordDataWithId: syncorAccount,
      })
      const queryResult = await salesforce.query(sampleQuery2)
      queryResult.records[0]._fields.accountnumber.should.equal(syncorAccount.AccountNumber)
    })

    it('be able to reset the data back ', async () => {
      await salesforce.updateRecord({
        sObjectName: 'Account',
        recordDataWithId: syncorAccountReset,
      })
      const queryResult = await salesforce.query(sampleQuery2)
      queryResult.records[0]._fields.accountnumber.should.equal(syncorAccountReset.AccountNumber)
    })
  })
})
