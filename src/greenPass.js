async function load() {
  return true
}

async function run(message) {
  const messageCleaned = message.toLowerCase()

  const check1 = messageCleaned.includes('passaporti sanitari') || messageCleaned.includes('greenpass') || messageCleaned.includes('green pass')
  const check2 = messageCleaned.includes('qrcode') || messageCleaned.includes('qr code') || messageCleaned.includes('qr-code') || messageCleaned.includes('codice qr')
  const check3 = messageCleaned.includes('certificato') || messageCleaned.includes('certificati')

  return (check1 && check2 && check3)
}

module.exports = {
  load,
  run
}