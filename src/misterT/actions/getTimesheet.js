'use strict';
const _ = require('lodash')
const moment = require('moment')
const slack = require('../../slack')(true)
const config = require('../../config')
const redmine = require('../../redmine')(config.redmineUrl, config.redmineApiKey)
const ideatos = require('../../ideatos')

module.exports = function(req, respond) {
  retrieveUser(req.originalRequest, (error, user) => {

    if (error) {
      respond('Unable to retrieve user')
    }
    const day = req.result.parameters.date

    retrieveLogFor(user, day, (error, workEntries) => {
      if(error) {
        respond(error)
      }

      let speech = ''
      if(!workEntries) {
        speech = 'Mmmm sembra che tu non abia lavorato, hai dimenticato di aggiornare il timesheet?'
      } else {
        speech = `${humanReadableDate(day)} hai lavorato:\n${workEntries}`
      }

      respond(null, {
        speech: speech,
        displayText: speech,
        source: 'mister-t-webhook'
      })
    })
  })
}

function retrieveUser (slackRequest, cb) {

  if (!slackRequest) {
    const APIAI_CONSOLE_FAKE_USER = '@ftassi'
    cb(false, APIAI_CONSOLE_FAKE_USER)
    return
  }

  const source = slackRequest.source

  if (!source.startsWith('slack')) {
    cb(`Invalid source: expected slack got ${source}`)
    return
  }

  slack.retrieveUsername(slackRequest.data.user, (error, user) => {
    if (error) {
      cb('Unable to retrieve user')
      return
    }

    cb(false, user)
  })
}

function retrieveLogFor (user, day, done) {
  redmine.timeSheet.retrieveLog(
    ideatos.bySlackName(user).redmineId,
    day,
    day,
    (err, logs) => {
      if(err) {
        logs(err)
      }
      done(false, stringifyLogs(logs))
    }
  )
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

function stringifyLogs (logs) {
  return _.map(logs, log => {
    return `su ${log.project} (${log.issue.name}) per ${log.hours} ore`
  }).join('\n')
}