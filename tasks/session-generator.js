const { TelegramClient } = require('telegram')
const { StringSession } = require("telegram/sessions")
const input = require('input')

async function run() {
  let tgAppApiId = await input.text("Please enter your telegram app api id: ")
  tgAppApiId = parseInt(tgAppApiId)
  let tgAppApiKey = await input.text("Please enter your telegram app api hash: ")

  // configurate new client
  const client = new TelegramClient(new StringSession(''), tgAppApiId, tgAppApiKey, { connectionRetries: 5 })

  // connect new client
  await client.start({
    phoneNumber: async () => await input.text("Please enter your number: "),
    password: async () => await input.text("Please enter your password: "),
    phoneCode: async () => await input.text("Please enter the code you received: "),
    onError: (err) => console.log(err)
  })
  console.log('Your Telegram Session ID:', client.session.save())

  return true
}

run()