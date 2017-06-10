'use strict';

const express = require('express')
const bodyParser = require('body-parser')
const skills = require('./misterT/skills')
const config = require('./config')
const restService = express()

restService.use(bodyParser.json())

restService.post('/hook', function (req, res) {
  if(!req.body.result.action) {
    res.status(500).send('Missing action');
  }
  const replyTo = skills(req.body.result.action)

  if(!replyTo) {
    res.status(404).send("Don't know what to do");
  }

  replyTo(req.body)
    .then(response => res.json(response))
    .catch(err => res.status(500).send(err))
})

restService.listen(config.webhookPort, function () {
  console.log(`server listening on 127.0.0.1:${config.webhookPort}`)
})