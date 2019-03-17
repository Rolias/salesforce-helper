const chai = require('chai')
chai.should()
const nforce = require('nforce')
const fs = require('fs')
const sandbox = require('sinon').createSandbox()
const Sf = require('./salesforce')

const fakeCreds = `{
  "sfHelperProduction": {
    "clientId": "FakeProductionClientId",
    "clientSecret": "FakeProductionClientSecret",
    "securityToken": "FakeProductionSecurityToken",
    "username": "mickey@mouse.com",
    "password": "FakeProductionPassword"
  },
  "sfHelperDevelopment": {
    "clientId": "FakeDevelopmentClientId",
    "clientSecret": "FakeDevelopmentClientSecret",
    "securityToken": "FakeDevelopmentSecurityToken",
    "username": "mickey@mouse.com",
    "password": "FakeDevelopmentPassword"
  }
}`
const fakeCredsObj = JSON.parse(fakeCreds)
let connectSpy

describe('Salesforce class', () => {
  beforeEach(() => {
    sandbox.stub(fs, 'readFileSync').returns(fakeCreds)
    connectSpy = sandbox.spy(nforce, 'createConnection')// .returns('connection')
  })

  afterEach(() => {
    sandbox.restore()
  })

  describe('constructor()', () => {
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
      const [nForceCreateConnectionParam] = connectSpy.getCall(0).args
      const {clientId} = fakeCredsObj.sfHelperProduction
      nForceCreateConnectionParam.clientId.should.contain(clientId)
    })
  })

  describe('authenticate() ', () => {
    it('should invoke nforce authenticate with auth settings', async () => {
      const sf = new Sf()
      sf.createConnection()
      const stubby = sandbox.stub(sf.org, 'authenticate').resolves('')// .yields(null, 'response')
      await sf.authenticate() // puts oauth object on the org property in single mode.
      const {username, password, securityToken} = fakeCredsObj.sfHelperProduction
      const expected = {username, password, securityToken}
      const [authObj] = stubby.getCall(0).args
      authObj.should.deep.equal(expected)

    })

    describe('create()', () => {
      it('should return Sf object with org property', async () => {
        sandbox.stub(Sf.prototype, 'authenticate').resolves('anything')
        const sf = await Sf.create()
        Object.keys(sf).should.contain('org')
      })
    })

  })
})