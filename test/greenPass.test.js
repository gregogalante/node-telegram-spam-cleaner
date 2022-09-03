const assert = require('assert')
const greenPass = require('../src/greenPass')

const spamMessages = [
  'Vendo certificati verdi. Passaporti sanitari validi in tutta Europa dotati di codice qr.'
]

const notSpamMessages = [
  'Io credo che i green pass non siano un problema.'
]

describe('greenPass', function() {
  before(async () => {
    await greenPass.load()
  })

  it('should block spam messages', async () => {
    for (let message of spamMessages) {
      const result  = await greenPass.run(message)
      assert.equal(result , true)
    }
  })

  it('should not block not spam messages', async () => {
    for (let message of notSpamMessages) {
      const result  = await greenPass.run(message)
      assert.equal(result , false)
    }
  })
})