'use strict';

module.exports = {
  range
}

function range (date) {
  if (date.date) {
    return { from: date.date, to: date.date }
  }

  if (date[ 'date-period' ]) {
    return {
      from: date[ 'date-period' ].split('/')[ 0 ],
      to: date[ 'date-period' ].split('/')[ 1 ]
    }
  }

  if(isNaN(Date.parse(date)) === false){
    return range({date})
  }

  throw new InvalidDateEntity();
}

function InvalidDateEntity(message) {
  this.name = 'InvalidDateEntity';
  this.message = message || 'Unable to parse the date';
  this.stack = (new Error()).stack;
}
InvalidDateEntity.prototype = Object.create(Error.prototype);
InvalidDateEntity.prototype.constructor = InvalidDateEntity;
