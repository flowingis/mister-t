'use strict';
const _ = require('lodash')
const moment = require('moment')
const slack = require('../../slack')(true)
const config = require('../../config')
const redmine = require('../../redmine')(config.redmineUrl, config.redmineApiKey)
const ideatos = require('../../ideatos')
const dateRange = require('../entities/date').range

module.exports = function(req, respond) {
  retrieveUser(req.originalRequest, (error, user) => {

    if (error) {
      respond('Unable to retrieve user')
    }
    const date = req.result.parameters.date
    try {
      const range = dateRange(date)
    }catch (e) {
      respond(null, {
        speech: 'Mi spiace ma non ho capito di che giorno stai parlando',
        displayText: 'Mi spiace ma non ho capito di che giorno stai parlando',
        source: 'mister-t-webhook'
      })
    }

    redmine.timeSheet.retrieveLog(
      ideatos.bySlackName(user).redmineId,
      range.from,
      range.to,
      (error, workEntries) => {
        if (error) {
          respond(error)
        }

        let speech = ''
        if (!workEntries) {
          speech = 'Mmmm sembra che tu non abia lavorato, hai dimenticato di aggiornare il timesheet?'
        } else {
          speech = `Vedo che hai lavorato:\n${stringifyLogs(workEntries)}`
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
    return `su ${log.project} (${log.issue.name}) per ${log.hours} ore ${humanReadableDate(log.date)}`
  }).join('\n')
}