/* eslint-env mocha */
const mockBot = require('../mockBot')
const assert = require('assert')

const correctMessage = function (vol, abv, units) {
  return `${vol}ml at ${abv}% is ${units} units`
}

describe('abv module', function () {
  before(function () {
    mockBot.loadModule('abv')
  })
  it('should handle nonsense', function () {
    assert.equal(mockBot.runCommand('!abv eternal september'), 'can\'t compute that')
  })
  it('should understand imperial units', function () {
    assert.equal(mockBot.runCommand('!abv pint 5%'), correctMessage(568, 5, 2.84))
  })
})
