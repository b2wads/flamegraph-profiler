const { expect } = require('chai')
const { cpuProfiler } = require('../')

console.log(cpuProfiler)

const busyWait = (timeInMs) => {
    begin = new Date().getTime()
    do {
      elapsedTime = new Date().getTime() - begin
    } while (elapsedTime < timeInMs)
}

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
    let callbackCalled = false
    before(() => {
      try {
        cpuProfiler.start('test2')
      } catch (err) {
        startError = err
      }

      try {
        cpuProfiler.stop('test2', () => {
          callbackCalled = true
        })
        busyWait(1)
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

    it('should call the callback method in less than 1ms', () => {
      expect(callbackCalled).to.be.true
    })
  })

  describe('when extracting data from the profiler', () => {
    let data
    before(() => {
      cpuProfiler.start('test3')
      for (let i = 0; i < 100000000; i++) {
        (() => {})()
      }
      cpuProfiler.stop('test3', (err, profilerData) => {
        data = profilerData
      })
      busyWait(1)
    })

    it('should send string containing collected metricts to callback method in less than 1ms', () => {
      expect(typeof data).to.be.equal('string')
      expect(data).to.not.be.empty
      expect(data).to.have.string('cpu_profiler.spec.js')
    })
  })
})