'use strict'
const _ = require('lodash')
const moment = require('moment')
const dateRange = require('./entities/date').range
const logger = require('../../logger')()

module.exports = function ({sender: user, workEntries}) {
  return async function getTimesheet (req) {
    if (!req.queryResult.allRequiredParamsPresent) {
      logger.debug('missing required params')
      return
    }

    const date = req.queryResult.parameters.date
    let range
    try {
      range = dateRange(date)
    } catch (e) {
      logger.error(e)
      logger.debug(date, 'Parsed date')

      return {
        fulfillmentText: 'Mi spiace ma non ho capito di che giorno stai parlando'
      }
    }

    try {
      const userWorkEntries = await workEntries(await user(req), range.from, range.to)
      let speech = ''

      if (userWorkEntries.length === 0) {
        speech = 'Mmmm sembra che tu non abbia lavorato, forse devi <https://report.ideato.it/|aggiornare il timesheet>?'
      } else {
        speech = `Vedo che hai lavorato:\n${stringifyLogs(userWorkEntries)}`
      }

      return {fulfillmentText: speech}
    } catch (e) {
      logger.error(e.message)
      throw e
    }
  }
}

function humanReadableDate (day) {
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
