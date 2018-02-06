'use strict'

const http = require('http')
const config = require('./config/config')

http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'application/json'})
  res.end(JSON.stringify({
    'speech': 'Presto ti darò i dati del timesheet',
    'displayText': 'Presto ti darò i dati del timesheet'
  }))
}).listen(config.webHook.listenPort)
