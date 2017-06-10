'use strict';
const _ = require('lodash')
const moment = require('moment')
const slack = require('../../slack')(true)
const config = require('../../config')
const redmine = require('../../redmine')(config.redmineUrl, config.redmineApiKey)
const ideatos = require('../../ideatos')
const dateRange = require('../entities/date').range

module.exports = async function (req) {
  const user = await retrieveUser(req.originalRequest)
  const date = req.result.parameters.date
  let range
  try {
    range = dateRange(date)
  } catch (e) {
    return {
      speech: 'Mi spiace ma non ho capito di che giorno stai parlando',
      displayText: 'Mi spiace ma non ho capito di che giorno stai parlando',
      source: 'mister-t-webhook'
    }
  }

  const workEntries = await redmine.timeSheet.retrieveLog(ideatos.bySlackName(user).redmineId, range.from, range.to)
  let speech = ''

  if (workEntries.length === 0) {
    speech = 'Mmmm sembra che tu non abia lavorato, hai dimenticato di aggiornare il timesheet?'
  } else {
    speech = `Vedo che hai lavorato:\n${stringifyLogs(workEntries)}`
  }

  return {
    speech: speech,
    displayText: speech,
    source: 'mister-t-webhook'
  }
}

function retrieveUser (slackRequest) {
  return new Promise((resolve, reject) => {
    if (!slackRequest) {
      const APIAI_CONSOLE_FAKE_USER = '@ftassi'
      resolve(APIAI_CONSOLE_FAKE_USER)
      return
    }

    const source = slackRequest.source

    if (!source.startsWith('slack')) {
      reject(`Invalid source: expected slack got ${source}`)
      return
    }

    slack.retrieveUsername(slackRequest.data.user, (error, user) => {
      if (error) {
        reject('Unable to retrieve user')
        return
      }

      resolve(user)
    })
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