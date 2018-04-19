'use strict'

require('should')

const ideatos = require('./ideatos')

describe('bySlackName', () => {
  it('should retrieve an ideatos by his slack name', () => {
    ideatos.bySlackName('@ftassi').should.be.deepEqual({redmineId: '95', slackId: '@ftassi'})
  })
})

describe('allSlackIds', () => {
  it('should return a list of ideatos on slack', () => {
    (ideatos.allSlackIds).should.containEql('@ftassi')
  })
})
