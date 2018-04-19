'use strict'

require('should')

const getTimesheet = require('./getTimesheet')

const noEntries = (user, from, to) => []
const aUser = () => '@ftassi'

describe('getTimesheet', () => {
  it('should skip incomplete actions', () => {
    const skill = getTimesheet({sender: aUser, workEntries: noEntries})
    const anIncompleteRequest = {queryResult: {allRequiredParamsPresent: false}}
    return skill(anIncompleteRequest).should.be.eventually.undefined()
  })
  it('should apologize for missing date range', () => {
    const skill = getTimesheet({sender: aUser, workEntries: noEntries})

    const aRequestWithInvalidDate = {queryResult: {allRequiredParamsPresent: true, parameters: {date: 'invalid-date'}}}
    return skill(aRequestWithInvalidDate).should.be.eventually.deepEqual({
      fulfillmentText: 'Mi spiace ma non ho capito di che giorno stai parlando'
    })
  })

  it('should tell users no logs exists for a specific period', () => {
    const skill = getTimesheet({sender: aUser, workEntries: noEntries})

    const aRequestForTimesheetSpecificDay = {
      queryResult: {
        allRequiredParamsPresent: true,
        parameters: {date: '2018-04-19T12:00:00+02:00'}
      }
    }
    return skill(aRequestForTimesheetSpecificDay).should.be.eventually.deepEqual({
      fulfillmentText: 'Mmmm sembra che tu non abbia lavorato, forse devi <https://report.ideato.it/|aggiornare il timesheet>?'
    })
  })

  it('should tell users about his timesheet', () => {
    const someEntries = (user, from, to) => {
      return [
      {project: 'Foo Project', issue: {name: 'Some activity'}, hours: 6, date: '2017-01-01'},
      {project: 'Bar Project', issue: {name: 'A different activity'}, hours: 2, date: '2017-01-01'}
      ]
    }
    const skill = getTimesheet({sender: aUser, workEntries: someEntries})

    const aRequestForTimesheetSpecificDay = {
      queryResult: {
        allRequiredParamsPresent: true,
        parameters: {date: '2018-04-19T12:00:00+02:00'}
      }
    }

    return skill(aRequestForTimesheetSpecificDay).should.be.eventually.deepEqual({
      fulfillmentText: 'Vedo che hai lavorato:\nsu Foo Project (Some activity) per 6 ore 01/01/2017\nsu Bar Project (A different activity) per 2 ore 01/01/2017'
    })
  })
})
