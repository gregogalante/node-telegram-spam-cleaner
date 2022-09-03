// Require the framework and instantiate it
require('dotenv').config()
const fastify = require('fastify')({ logger: true })
const { TelegramClient, Api } = require('telegram')
const { StringSession } = require('telegram/sessions')
const basePath = process.env.NODE_BASE_PATH || ''
const port = process.env.NODE_PORT || 3000
const tgAppApiId = parseInt(process.env.TG_APP_API_ID)
const tgAppApiKey = process.env.TG_APP_API_HASH
const tgSession = process.env.TG_SESSION
const tgGroupIds = process.env.TG_GROUP_IDS.split(',')

let running = false

// Declare a route
fastify.get(`${basePath || '/'}`, async (request, reply) => {
  return { hello: 'world' }
})
fastify.get(`${basePath}/status`, async (request, reply) => {
  return { tgGroupIds, running }
})

// Run the server!
const start = async () => {
  try {
    await fastify.listen(port)
    await run()
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()

////////////////////////////////////////////////////////////////////////////////

const greenPass = require('./src/greenPass')

async function run() {
  // configurate new client
  const client = new TelegramClient(new StringSession(tgSession), tgAppApiId, tgAppApiKey, { connectionRetries: 5 })

  // connect new client
  await client.start({})

  setInterval(async () => {
    const timestampStart = new Date().getTime()
    let count = 0

    for (let tgGroupId of tgGroupIds) {
      console.log('Start fetching messages from group', tgGroupId)

      const idToDelete = []
      const history = await client.invoke(new Api.messages.GetHistory({ peer: tgGroupId, limit: 100 }))
      console.log('Detected messages:', history.messages.length)

      for (let message of history.messages) {
        if (message.className != 'Message') continue
        const isValid = await validateMessage(message.message)
        if (!isValid) {
          idToDelete.push(message.id)
        }
      }
      console.log('Detected messages to delete:', idToDelete.length)

      if (idToDelete.length > 0) {
        await client.invoke(new Api.channels.DeleteMessages({ channel: tgGroupId, id: idToDelete }))
        count += idToDelete.length
      }
      console.log('Deleted messages:', idToDelete.length)
    }

    const timestampEnd = new Date().getTime()
    console.log(`Deleted ${count} messages in ${timestampEnd - timestampStart}ms \n`)

    return true
  }, 30000)

  running = true

  return true
}

async function validateMessage(message) {
  await greenPass.load()
  const invalidFor_greenPass = await greenPass.run(message)
  if (invalidFor_greenPass) return false

  return true
}
