const fs = require('fs')
const config = require('./config/config')
const pino = require('pino')

const stream = fs.createWriteStream(config.logFile, {flag: 'a'})

module.exports = function () {
  return pino({
    level: config.logLevel
  },
    stream)
}
