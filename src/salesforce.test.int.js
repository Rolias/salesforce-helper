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

const testAccount = {
  name: 'createAndDelete',
}

// eslint-disable-next-line prefer-arrow-callback
describe('name or description of test', async function () {
  before(async () => {
    salesforce = await Sf.create(param)
    logger.level = 'info'
  })
  after(() => {
    logger.level = 'debug'
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

  describe('inserting and deleting', () => {
    let newId

    it('insertRecord() should return the id and indicate success', async () => {
      const insertResult = await salesforce.insertRecord({
        sObjectName: 'Account',
        recordData: testAccount,
      })
      logger.debug(`insertRecord result->${stringify(insertResult)}`)
      insertResult.success.should.be.true
      newId = insertResult.id
    })

    it('query() should find the newly created record', async () => {
      const newRecord = await salesforce.query(`SELECT id FROM Account WHERE id ='${newId}'`)
      newRecord.totalSize.should.equal(1)
      logger.debug(`queryResult->${stringify(newRecord)}`)
    })

    it('delete() should remove the record', async () => {
      await salesforce.deleteRecord({
        sObjectName: 'Account',
        recordDataWithId: {id: newId},
      })
      const queryForDeletedRecord = await salesforce.query(`SELECT id FROM Account WHERE id ='${newId}'`)
      queryForDeletedRecord.totalSize.should.equal(0)
    })
  })
})
