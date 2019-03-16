const chai = require('chai')
chai.should()
const logger = require('./util/logger')
const {stringify} = require('./util/helper')
const Sf = require('./salesforce')
const sampleQuery = 'SELECT ID, Name FROM Account LIMIT 10'

let salesforce
before(async () => {
  //  await salesforce.init()
  const param = {
    path: '/Users/tod-gentille/dev/node/ENV_VARS/salesforce.env.json',
    type: Sf.CRED_TYPE.DEVELOPMENT,
  }
  salesforce = await Sf.create(param)
})

// eslint-disable-next-line prefer-arrow-callback
describe('name or description of test', async function () {

  this.timeout(5000)

  it('query() should get ten records back', async () => {

    console.log('init done')

    const queryResult = await salesforce.query(sampleQuery)
    for (const record of queryResult) {
      logger.verbose(stringify(record))
    }
    queryResult.length.should.equal(10)
  })
})