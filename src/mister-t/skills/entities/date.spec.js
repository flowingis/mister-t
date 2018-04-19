'use strict'

require('should')
const moment = require('moment')

const dateRange = require('./date').range

describe('date entitiy', () => {
  const dialogFlowDate = {date: '2018-04-19T12:00:00+02:00'}
  const dialogFlowDatePeriod = {
    'date-period': {
      endDate: '2018-04-15T12:00:00+02:00',
      startDate: '2018-04-09T12:00:00+02:00'
    }
  }
  it('should return a range from a single date', () => {
    const range = dateRange(dialogFlowDate)
    range.from.toString().should.equal(moment('2018-04-19').toString())
    range.from.should.deepEqual(range.to)
  })

  it('should return a range from a date period', () => {
    const range = dateRange(dialogFlowDatePeriod)
    range.from.toString().should.equal(moment('2018-04-09').toString())
    range.to.toString().should.equal(moment('2018-04-15').toString())
  })

  it('should throw for invalid date', () => {
    (() => dateRange({})).should.throw()
  })
})
