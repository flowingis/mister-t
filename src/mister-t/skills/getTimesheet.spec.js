'use strict'

require('tap').mochaGlobals()
require('should')
const getTimesheet = require('./getTimesheet')

const noEntries = (user, from, to) => []
const aUser = () => '@ftassi'

describe('getTimesheet', () => {
  it('should skip incomplete actions', () => {
    const skill = getTimesheet({sender: aUser, workEntries: noEntries})
    const anIncompleteRequest = {result: {actionIncomplete: true}}
    skill(anIncompleteRequest).should.be.eventually.undefined()
  })
  it('should apologize for missing date range', () => {
    const skill = getTimesheet({sender: aUser, workEntries: noEntries})

    const aRequestWithInvalidDate = {result: {parameters: {date: 'invalid-date'}}}
    skill(aRequestWithInvalidDate).should.be.eventually.deepEqual({
      speech: 'Mi spiace ma non ho capito di che giorno stai parlando',
      displayText: 'Mi spiace ma non ho capito di che giorno stai parlando',
      source: 'mister-t-webhook'
    })
  })

  it('should tell users no logs exists for a specific period', () => {
    const skill = getTimesheet({sender: aUser, workEntries: noEntries})

    const aRequestForTimesheetSpecificDay = {result: {parameters: {date: {date: '2017-01-01'}}}}
    skill(aRequestForTimesheetSpecificDay).should.be.eventually.deepEqual({
      speech: 'Mmmm sembra che tu non abbia lavorato, forse devi <https://report.ideato.it/|aggiornare il timesheet>?',
      displayText: 'Mmmm sembra che tu non abbia lavorato, forse devi <https://report.ideato.it/|aggiornare il timesheet>?',
      source: 'mister-t-webhook'
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

    const aRequestForTimesheetSpecificDay = {result: {parameters: {date: {date: '2017-01-01'}}}}

    skill(aRequestForTimesheetSpecificDay).should.be.eventually.deepEqual({
      speech: 'Vedo che hai lavorato:\nsu Foo Project (Some activity) per 6 ore 01/01/2017\nsu Bar Project (A different activity) per 2 ore 01/01/2017',
      displayText: 'Vedo che hai lavorato:\nsu Foo Project (Some activity) per 6 ore 01/01/2017\nsu Bar Project (A different activity) per 2 ore 01/01/2017',
      source: 'mister-t-webhook'
    })
  })
})
