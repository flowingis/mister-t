'use strict';

const moment = require('moment');

module.exports.last = (now) => {

  switch(now.day())
  {
    // If it is Monday (1),Saturday(6), or Sunday (0), Get the previous Friday (5)
    // and ensure we are on the previous week
    case 0:
    case 1:
    case 6:
      return now.clone().subtract(6,'days').day(5);
    // If it any other weekend, just return the previous day
    default:
      return now.clone().add(-1, 'days')
  }
};