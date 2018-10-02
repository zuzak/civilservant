/* eslint-env mocha */
const mockBot = require('../mockBot')
const assert = require('assert')

describe('countdown module', function () {
  before(function () {
    mockBot.loadModule('countdown')
  })

  it('outputs something vaguely sensible', function () {
    assert.notEqual(mockBot.runCommand('!a50').match(/Article 50 expires in \d+\s\w+/), false)
  })
})
