/* eslint-env mocha */
const mockBot = require('../mockBot')
const assert = require('assert')

describe('buttery module', function () {
  before(function () {
    mockBot.loadModule('hello')
  })

  it('should say hello', function () {
    assert.equal(mockBot.runCommand('!hello'), 'Hello, world!')
  })
})
