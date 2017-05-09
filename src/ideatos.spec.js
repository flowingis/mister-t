'use strict';

require('tap').mochaGlobals();
const should = require('should');
const bySlackName = require('./ideatos').bySlackName;

describe('bySlackName', () => {
  it('should retrieve an ideatos by his slack name', () => {
    bySlackName('@ftassi').should.be.deepEqual({redmineId: '95', slackId: '@ftassi'})
  });
});


