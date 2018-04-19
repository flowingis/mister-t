'use strict'

const moment = require('moment')

module.exports = {
  range
}

function range (dialogFlowDate) {
  if (dialogFlowDate.date) {
    const date = day(dialogFlowDate.date)
    return { from: date, to: date }
  }

  if (dialogFlowDate[ 'date-period' ]) {
    return {
      from: day(dialogFlowDate[ 'date-period' ].startDate),
      to: day(dialogFlowDate [ 'date-period' ].endDate)
    }
  }

  if (isNaN(Date.parse(dialogFlowDate)) === false) {
    return range({date: dialogFlowDate})
  }

  throw new InvalidDateEntity()
}

function day (date) {
  return moment(date).startOf('day')
}

function InvalidDateEntity (message) {
  this.name = 'InvalidDateEntity'
  this.message = message || 'Unable to parse the date'
  this.stack = (new Error()).stack
}
InvalidDateEntity.prototype = Object.create(Error.prototype)
InvalidDateEntity.prototype.constructor = InvalidDateEntity
