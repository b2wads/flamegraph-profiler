const { expect } = require('chai')
const cpuProfiler = require('bindings')('native_cpu_profiler')
const path = require('path')

const busyWait = timeInMs => {
  const begin = new Date().getTime()
  let elapsedTime
  do {
    elapsedTime = new Date().getTime() - begin
  } while (elapsedTime < timeInMs)
}

describe('when using the native CPU Profiler', () => {
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
        cpuProfiler.stop('test2', 'random_root_script', 0, () => {
          callbackCalled = true
        })
        busyWait(3)
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

    it('should call the callback method in less than 3ms', () => {
      expect(callbackCalled).to.be.true
    })
  })

  describe('when extracting data from the profiler', () => {
    context('with synchronous callback', () => {
      let data
      const rootScript = 'test/native-cpu-profiler.spec.js'
      const projectRoot = path.normalize(`${__dirname}/..`)
      before(() => {
        cpuProfiler.start('test3')
        for (let i = 0; i < 100000000; i += 1) {
          ;(() => {})()
        }
        cpuProfiler.stop(
          'test3',
          rootScript,
          projectRoot.length + 1,
          (err, profilerData) => {
            data = profilerData
          }
        )
        busyWait(3)
      })

      it('should send a new line terminated string containing collected metricts to callback method in less than 3ms', () => {
        expect(typeof data).to.be.equal('string')
        expect(data).to.not.be.empty
        expect(data.charAt(data.length - 1)).to.be.equal('\n')
      })

      it('should not have a single stack trace which does not begin at the root script', () => {
        const stackTraces = data.split('\n').slice(0, -1)
        stackTraces.forEach(stackTrace => {
          const stackTraceBegin = stackTrace.substring(0, rootScript.length)
          expect(stackTraceBegin).to.be.equal(rootScript)
        })
      })
    })

    context('with asynchronous callback', () => {
      let data
      const rootScript = 'test/native-cpu-profiler.spec.js'
      const projectRoot = path.normalize(`${__dirname}/..`)
      before(() => {
        cpuProfiler.start('test3')
        for (let i = 0; i < 100000000; i += 1) {
          ;(() => {})()
        }
        cpuProfiler.stop(
          'test3',
          rootScript,
          projectRoot.length + 1,
          async (err, profilerData) => {
            data = profilerData
          }
        )
        busyWait(1)
      })

      it('should send a new line terminated string containing collected metricts to callback method in less than 3ms', () => {
        expect(typeof data).to.be.equal('string')
        expect(data).to.not.be.empty
        expect(data.charAt(data.length - 1)).to.be.equal('\n')
      })

      it('should not have a single stack trace which does not begin at the root script', () => {
        const stackTraces = data.split('\n').slice(0, -1)
        stackTraces.forEach(stackTrace => {
          const stackTraceBegin = stackTrace.substring(0, rootScript.length)
          expect(stackTraceBegin).to.be.equal(rootScript)
        })
      })
    })
  })
})
