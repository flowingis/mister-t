'use strict'

require('tap').mochaGlobals()
require('should')
const moment = require('moment')
const last = require('./businessDays').last

describe('last', () => {
  it('should return last friday on monday', () => {
    const aMonday = moment('2017-03-20')
    const previousFriday = moment('2017-03-17')

    last(aMonday).format('YYYY-MM-DD').should.equal(previousFriday.format('YYYY-MM-DD'))
  })

  it('should return yesterday on friday', () => {
    const aBusinessDay = moment('2017-03-17')
    const previousBusinessDay = moment('2017-03-16')

    last(aBusinessDay).format('YYYY-MM-DD').should.equal(previousBusinessDay.format('YYYY-MM-DD'))
  })
})
