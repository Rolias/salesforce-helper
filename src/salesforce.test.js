const chai = require('chai')
chai.should()
const nforce = require('nforce')
const fs = require('fs')
const envCreate = require('env-create')
const sandbox = require('sinon').createSandbox()
const sinonChai = require('sinon-chai')
chai.use(sinonChai)
const Sf = require('./salesforce')
const fakeCredsObj = require('./test-data/unit-test-fake-creds.json')
const fakeCreds = JSON.stringify(fakeCredsObj)

let connectSpy

describe('Salesforce class', () => {
  beforeEach(() => {
    sandbox.stub(fs, 'readFileSync').returns(fakeCreds)
    connectSpy = sandbox.spy(nforce, 'createConnection')
  })

  afterEach(() => {
    sandbox.restore()
  })

  describe('constructor()', () => {

    it('should throw when it does not load credentials', () => {
      sandbox.stub(envCreate, 'load').returns({status: false})
        ; (() => {new Sf()}).should.throw('FATAL ERROR')
    })

    it('should return production creds with no params', () => {
      // for real life a .env.json file would need to exist
      const expected = Sf.CRED_TYPE.getType(Sf.CRED_TYPE.PRODUCTION)
      const result = new Sf()
      result.authObj.securityToken.toLowerCase().should.contain(expected)
    })

    it('should return Development credentials when that type specified', () => {
      const result = new Sf({path: 'a fake path', type: Sf.CRED_TYPE.DEVELOPMENT})
      const expected = Sf.CRED_TYPE.getType(Sf.CRED_TYPE.DEVELOPMENT)
      result.authObj.securityToken.toLowerCase().should.contain(expected)
    })

  })
  describe('createConnection() ', () => {
    it('should receive a parameter with five fields', () => {
      const sf = new Sf()
      sf.createConnection()
      const [[nForceCreateConnectionParam]] = connectSpy.args
      const {clientId} = fakeCredsObj.sfHelperProduction

      nForceCreateConnectionParam.clientId.should.contain(clientId)
      connectSpy.should.have.been.calledWithMatch({clientId})
    })
  })

  describe('authenticate() ', () => {
    it('should invoke nforce authenticate with auth settings', async () => {
      const sf = new Sf()
      sf.createConnection()
      const stubby = sandbox.stub(sf.org, 'authenticate').resolves('')
      await sf.authenticate() // puts oauth object on the org property in single mode.
      const {username, password, securityToken} = fakeCredsObj.sfHelperProduction
      const expected = {username, password, securityToken}
      stubby.should.have.been.calledWith(expected)

    })

    describe('create()', () => {
      it('should return Sf object with org property', async () => {
        sandbox.stub(Sf.prototype, 'authenticate').resolves('anything')
        const sf = await Sf.create()
        Object.keys(sf).should.contain('org')
      })
    })
  })

  describe('CRUD Operations', () => {
    let sf
    let testNameRecordObj = {}
    beforeEach(async () => {
      sandbox.stub(Sf.prototype, 'authenticate').resolves('anything')
      sf = await Sf.create()
      testNameRecordObj = {
        sObjectName: 'Account',
        recordDataWithId: {
          id: 123,
          name: 'Colaiuta',
        },
      }
    })

    describe('query()', () => {
      it('should call org.query with an object made of passed string {query:string}', async () => {
        const stubby = sandbox.stub(sf.org, 'query').resolves('record')
        const soql = 'SELECT Name from Account'
        sf.query(soql)
        stubby.should.have.been.calledWith({query: soql})
      })
    })

    describe('updateRecord()', () => {
      it('should call org.update with sobject that has field with expected name ', () => {
        const stubby = sandbox.stub(sf.org, 'update').resolves('record')
        sf.updateRecord(testNameRecordObj)
        stubby.should.have.been.calledWithMatch({sobject: {_fields: {name: 'Colaiuta'}}})
      })
    })

    describe('insertRecord() ', () => {
      it('should call org.insert with sobject', () => {
        const stubby = sandbox.stub(sf.org, 'insert').resolves('record')
        sf.insertRecord(testNameRecordObj)
        stubby.should.have.been.calledWithMatch({sobject: {}})
      })
    })

    describe('upsertRecord() with a record id should ', () => {
      let stubby
      beforeEach(() => {
        stubby = sandbox.stub(sf.org, 'upsert').resolves('record')
        sf.upsertRecord(testNameRecordObj)
      })

      it('call org.upsert with sobject that has externalId attribute', () => {
        stubby.should.have.been.calledWithMatch({sobject: {attributes: {externalId: 123}}})

      })
      it('call org.upsert with requestOpts  method set to PATCH ', () => {
        stubby.should.have.been.calledWithMatch({requestOpts: {method: 'PATCH'}})
      })

    })

    describe('upsertRecord() with no record id should ', () => {
      let stubby
      beforeEach(() => {
        stubby = sandbox.stub(sf.org, 'upsert').resolves('record')
        delete testNameRecordObj.recordDataWithId.id
        sf.upsertRecord(testNameRecordObj)
      })

      it('call org.upsert with requestOpts that has method set to POST when no id provided', () => {
        stubby.should.have.been.calledWithMatch({requestOpts: {method: 'POST'}})
      })
    })


    describe('deleteRecord()', () => {
      it('should call org.delete with an sobject', () => {
        const stubby = sandbox.stub(sf.org, 'delete').resolves('record')
        sf.deleteRecord(testNameRecordObj)
        stubby.should.have.been.calledWithMatch({sobject: {}})
      })
    })

    describe('getCourseFinanceInfo()', () => {
      it('should call sf.query with query string', () => {
        const iSpy = sandbox.spy(Sf.prototype, 'query')
        sandbox.stub(sf.org, 'query').resolves('record')
        const fakeCourseId = 'fake-course-id'
        sf.getCourseFinanceInfo(fakeCourseId)
        iSpy.should.have.been.calledWithMatch(fakeCourseId)

      })
    })


  })

})