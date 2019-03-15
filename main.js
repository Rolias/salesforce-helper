const logger = require('./src/util/logger')
const Sf = require('./src/salesforce')
const message = 'hello node world!'
logger.info(message)
// Leaving this outside the /src folder so that creating an npm package is more straight forward
// and seems to be canonical way this is done by the packages I've looked at.

const salesforce = new Sf('/Users/tod-gentille/dev/node/ENV_VARS/salesforce.env.json')
const auth = async () => {
  await salesforce.init()
  console.log('all done')
}
salesforce.init()
  .then(() => {
    console.log('all done')
  })

console.log("exit")