'use strict'
const express = require('express')
const bodyParser = require('body-parser')
const config = require('./config/config')
const misterT = require('./mister-t')
const app = express()

app.use(bodyParser.json())

app.get('/ping', (req, res) => {
  res.sendStatus(200)
})
app.post('/', async (req, res) => {
  res.json(await misterT.replyTo(req.body))
})

app.listen(config.webHook.listenPort)
