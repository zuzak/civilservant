/* eslint-env mocha */
const mockBot = require('../mockBot')
const assert = require('assert')

describe('abv module', function () {
  before(function () {
    mockBot.loadModule('abv')
  })
  it('should handle nonsense', function () {
    assert.equal(mockBot.runCommand('!abv eternal september'), 'can\'t compute that')
  })
  it('should understand imperial units')
  it('should work in both directions')
})
