'use strict';

const express = require('express')
const bodyParser = require('body-parser')
const getAction = require('./misterT/actions')
const config = require('./config')
const restService = express()

restService.use(bodyParser.json())

restService.post('/hook', function (req, res) {
  if(!req.body.result.action) {
    res.status(500).send('Missing action');
  }
  const action = getAction(req.body.result.action)

  if(!action) {
    res.status(404).send("Don't know what to do");
  }

  action(req.body, (err, apiAiResponse) => {
    if(err) {
      res.status(500).send(err);
    }

    return res.json(apiAiResponse)
  })
})

restService.listen(config.webhookPort, function () {
  console.log(`server listening on 127.0.0.1:${config.webhookPort}`)
})