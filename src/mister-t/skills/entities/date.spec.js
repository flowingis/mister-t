'use strict'

require('tap').mochaGlobals()
require('should')
const dateRange = require('./date').range

describe('date entitiy', () => {
  it('should return a range from a single date', () => {
    const apiaiParsedDate = {
      date: '2017-06-09'
    }

    dateRange(apiaiParsedDate).should.deepEqual({
      from: '2017-06-09',
      to: '2017-06-09'
    })

    dateRange('2017-06-09').should.deepEqual({
      from: '2017-06-09',
      to: '2017-06-09'
    })
  })

  it('should return a range from a date period', () => {
    const apiaiParsedDate = {
      'date-period': '2017-06-01/2017-06-30'
    }

    dateRange(apiaiParsedDate).should.deepEqual({
      from: '2017-06-01',
      to: '2017-06-30'
    })
  })

  it('should throw for invalid date', () => {
    (() => dateRange({})).should.throw()
  })
})
