'use strict'

require('should')

const assert = require('assert')
const timeEntry = require('./timeEntry')
const moment = require('moment')

const aTimeEntry = {
  'date': '2017-06-30',
  'duration': {
    'amount': 1,
    'unit': 'giorno'
  },
  'activity.original': 'attività di sviluppo,',
  'duration.object': {},
  'activity.object': {},
  'activity': 'attività di sviluppo',
  'projectName.original': 'wally',
  'date.original': 'oggi',
  'projectName': 'Wally',
  'duration.original': '1 giorno',
  'date.object': {},
  'projectName.object': {}
}
describe('time entry', () => {
  it('should parse project name', () => {
    const { projectName } = timeEntry(aTimeEntry)
    projectName.should.be.equal('Wally')
  })

  it('should parse activity', () => {
    const { issue } = timeEntry(aTimeEntry)
    issue.should.be.equal('attività di sviluppo')
  })

  it('should parse date', () => {
    const {date} = timeEntry(aTimeEntry)
    date.should.be.deepEqual(moment('2017-06-30'))
  })

  describe('duration parsing', () => {
    it('should parse duration and convert it to hour', () => {
      const { hours } = timeEntry(aTimeEntry)
      hours.should.be.equal(8)
    })

    it('should parse hours', () => {
      const { hours } = timeEntry({ duration: { amount: 4, unit: 'ora' } })
      hours.should.be.equal(4)
    })

    it('should throw for invalid unit', () => {
      assert.throws(
        () => timeEntry({ duration: { amount: 4, unit: 'mese' } }),
        err => {
          if (err.name === 'InvalidDurationUnitError') {
            return true
          }
        }
      )
    })
  })
})
