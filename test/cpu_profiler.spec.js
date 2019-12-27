const { expect } = require('chai')
const { cpuProfiler } = require('../')
const sinon = require('sinon')

console.log(cpuProfiler)

describe('when using the CPU Profiler', () => {
  describe('when starting the profiler', () => {
    let startError = false
    before(() => {
      try {
        cpuProfiler.start('test1')
      } catch (err) {
        startError = err
      }
    })

    it('should start without any errors', () => {
      expect(startError).to.be.false
    })
  })

  describe('when starting and stoping the profiler', () => {
    let startError = false
    let stopError = false
    const callbackStub = sinon.stub()
    before(() => {
      try {
        cpuProfiler.start('test2')
      } catch (err) {
        startError = err
      }

      try {
        cpuProfiler.stop('test2', callbackStub)
      } catch (err) {
        stopError = err
      }
    })

    it('should start without any errors', () => {
      expect(startError).to.be.false
    })

    it('should stop without any errors', () => {
      expect(stopError).to.be.false
    })

    it('should call the callback method', () => {
      expect(callbackStub.called).to.be.true
    })
  })
})