const { expect } = require('chai')
const sinon = require('sinon')
const path = require('path')
const nativeCpuProfiler = require('bindings')('native_cpu_profiler')

const Sampler = require('../src/sampler')

const projectRootLength = path.normalize(`${__dirname}/../..`).length

describe('when using the sampler', () => {
  describe('when starting and stoping the sampler', () => {
    context('with sampling inteval of 1', () => {
      const config = {
        description: 'test',
        targetScript: 'test-script.js',
        samplingInterval: 1,
        callback: sinon.stub()
      }
      const numberOfStarts = 3

      before(() => {
        sinon.stub(nativeCpuProfiler, 'start')
        sinon.stub(nativeCpuProfiler, 'stop')

        const sampler = new Sampler(config)

        for (let i = 0; i < numberOfStarts; i += 1) {
          sampler.start()
          sampler.stop()
        }
      })

      after(() => {
        nativeCpuProfiler.start.restore()
        nativeCpuProfiler.stop.restore()
      })

      it('should start the profiler every time', () => {
        expect(nativeCpuProfiler.start.called).to.be.true
        expect(nativeCpuProfiler.start.getCalls().length).to.be.equal(
          numberOfStarts
        )
      })

      it('should stop the profiler every time', () => {
        expect(nativeCpuProfiler.stop.called).to.be.true
        expect(nativeCpuProfiler.stop.getCalls().length).to.be.equal(
          numberOfStarts
        )
      })

      it('should start native profiler with the correct parameters', () => {
        expect(nativeCpuProfiler.start.getCall(0).args[0]).to.be.equal(
          config.description
        )
      })

      it('should stop the profiler with the correct parametrs', () => {
        expect(nativeCpuProfiler.stop.getCall(0).args).to.deep.equal([
          config.description,
          config.targetedScript,
          projectRootLength + 1,
          config.callback
        ])
      })
    })

    context('with sampling interval of 3 and 9 start/stops', () => {
      const config = {
        description: 'test',
        targetScript: 'test-script.js',
        samplingInterval: 3,
        callback: sinon.stub()
      }
      const numberOfStarts = 3

      before(() => {
        sinon.stub(nativeCpuProfiler, 'start')
        sinon.stub(nativeCpuProfiler, 'stop')

        const sampler = new Sampler(config)

        for (let i = 0; i < config.samplingInterval * numberOfStarts; i += 1) {
          sampler.start()
          sampler.stop()
        }
      })

      after(() => {
        nativeCpuProfiler.start.restore()
        nativeCpuProfiler.stop.restore()
      })

      it('should start the profiler 3 times', () => {
        expect(nativeCpuProfiler.start.called).to.be.true
        expect(nativeCpuProfiler.start.getCalls().length).to.be.equal(
          numberOfStarts
        )
      })

      it('should stop the profiler 3 times', () => {
        expect(nativeCpuProfiler.stop.called).to.be.true
        expect(nativeCpuProfiler.stop.getCalls().length).to.be.equal(
          numberOfStarts
        )
      })
    })
  })
})
