module.exports = function () {
  if (process.env.NODE_ENV === 'test') {
    return {
      debug: () => {},
      error: () => {}
    }
  }

  return {
    debug: console.info,
    error: console.error
  }
}
