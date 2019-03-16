const chai = require('chai')
chai.should()
const nforce = require('nforce')
const fs = require('fs')
const sandbox = require('sinon').createSandbox()

const fakeCreds = {
  sfHelperProduction: {
    clientId: 'FakeProductionClientId',
    clientSecret: 'FakeProductionClientSecret',
    securityToken: 'FakeProductionSecurityToken',
    username: 'mickey@mouse.com',
    password: 'FakeProductionPassword',
  },
  sfHelperDevelopment: {
    securityToken: 'FakeDevelopmentSecurityToken',
    clientId: 'FakeDevelopmentClientId',
    clientSecret: 'FakeDevelopmentClientSecret',
    username: 'tod.gentille@gmail.com',
    password: 'FakeDevelopmentPassword',
  },
}
describe('salesforce module', () => {
  before(() => {
    nforce.createConnection
    sandbox.stub(fs, 'readFile').returns(fakeCreds)
    // sandbox.stub(nforce, 'createConnection').returnValues('connection')
  })

  it('${true should be true}', () => {

    true.should.be.true
  })
})