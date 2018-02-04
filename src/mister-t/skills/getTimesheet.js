'use strict';
const _ = require('lodash')
const moment = require('moment')
const dateRange = require('../entities/date').range
const logger = require('../../logger')()

module.exports = function({getUser, getWorkEntries}) {
  return async function getTimesheet(req) {

    if(req.result.actionIncomplete) {
      return
    }

    const date = req.result.parameters.date
    let range
    try {
      range = dateRange(date)
    } catch (e) {
      logger.error(e)
      logger.debug(date, 'Parsed date')

      return {
        speech: 'Mi spiace ma non ho capito di che giorno stai parlando',
        displayText: 'Mi spiace ma non ho capito di che giorno stai parlando',
        source: 'mister-t-webhook'
      }
    }

    const workEntries = await getWorkEntries(await getUser(req), range.from, range.to)
    let speech = ''

    if (workEntries.length === 0) {
      speech = 'Mmmm sembra che tu non abbia lavorato, forse devi <https://report.ideato.it/|aggiornare il timesheet>?'
    } else {
      speech = `Vedo che hai lavorato:\n${stringifyLogs(workEntries)}`
    }

    return {
      speech: speech,
      displayText: speech,
      source: 'mister-t-webhook'
    }
  }
}

function humanReadableDate(day) {
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