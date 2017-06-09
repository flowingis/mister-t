'use strict';

const express = require('express')
const bodyParser = require('body-parser')
const moment = require('moment')
const _ = require('lodash')
const config = require('./config')
const redmine = require('./redmine')(config.redmineUrl, config.redmineApiKey)
const slack = require('./slack')(true)
const ideatos = require('./ideatos')
const restService = express()
restService.use(bodyParser.json())

restService.post('/hook', function(req, res) {
    retrieveUser(req.body.originalRequest, (error, user) => {
    if(error) {
      res.status(500).json({error: 'Unable to retrieve user'})
    }
    const day = req.body.result.parameters.date
    retrieveLogFor(user, day, (error, workEntries) => {
      return res.json({
        speech: `${humanReadableDate(day)} hai lavorato:\n${workEntries}`,
        displayText: `${humanReadableDate(day)} hai lavorato:\n${workEntries}`,
        source: 'mister-t-webhook'
      })
    })
  })
})

restService.listen(config.webhookPort, function(){
  console.log(`server listening on 127.0.0.1:${config.webhookPort}`)
})

function retrieveUser(slackRequest, cb){

  if(!slackRequest) {
    const APIAI_CONSOLE_FAKE_USER = '@ftassi'
    cb(false, APIAI_CONSOLE_FAKE_USER)
    return
  }

  const source = slackRequest.source

  if(!source.startsWith('slack')) {
    cb(`Invalid source: expected slack got ${source}`)
    return
  }

  slack.retrieveUsername(slackRequest.data.user, (error, user) => {
    if(error) {
      cb('Unable to retrieve user')
      return
    }

    cb(false, user)
  })
}

const humanReadableDate = function (day) {
  return moment(day).locale('it').calendar(null, {
    lastDay: '[Ieri]',
    sameDay: '[Oggi]',
    nextDay: '[Domani]',
    lastWeek: '[Lo scorso] dddd',
    nextWeek: 'dddd',
    sameElse: 'L'
  })
}

function retrieveLogFor(user, day, done) {
  redmine.timeSheet.retrieveLog(
    ideatos.bySlackName(user).redmineId,
    day,
    day,
    (err, logs) => done(false, stringifyLogs(logs))
  )
}

function stringifyLogs(logs) {
  return _.map(logs, log => {
    return `su ${log.project} (${log.issue.name}) per ${log.hours} ore`
  }).join('\n')
}