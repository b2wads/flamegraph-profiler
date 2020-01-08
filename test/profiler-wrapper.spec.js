const { expect } = require('chai')
const sinon = require('sinon')

const { ProfilerWrapper } = require('..')
const Sampler = require('../src/sampler')


describe('when using the function wrapper', () => {
  const functionFixture = sinon.stub().callsFake((a, b) => {
    return a+b
  })
  const asyncFunctionFixture = async (a, b) => {
    return functionFixture(a, b)
  }

  context('with profiler disabled', () => {
    let profiler
    before(() => {
      profiler = new ProfilerWrapper({
        disabled: true
      })
    })

    context('with synchronous function', () => {
      let wrappedFunction
      before(() => {
        wrappedFunction = profiler.wrap(functionFixture)
      })

      it('should return unaltered function', () => {
        expect(wrappedFunction).to.be.equal(functionFixture)
      })
    })
  
    context('with asynchronous function', () => {
      let wrappedFunction
      before(() => {
        wrappedFunction = profiler.wrapAsync(asyncFunctionFixture)
      })

      it('should return unaltered function', () => {
        expect(wrappedFunction).to.be.equal(asyncFunctionFixture)
      })
    })
  })

  context('with profiler enabled', () => {
    let profiler
    before(() => {
      profiler = new ProfilerWrapper()
    })
    context('with synchronous function', () => {
      const argA = 2
      const argB = 3

      let wrappedFunction
      let wrappedFunctionReturn
      before(() => {
        sinon.stub(Sampler.prototype, 'start')
        sinon.stub(Sampler.prototype, 'stop')
        wrappedFunction = profiler.wrap(functionFixture)
        wrappedFunctionReturn = wrappedFunction(argA, argB)
      })

      after(() => {
        Sampler.prototype.start.restore()
        Sampler.prototype.stop.restore()
      })

      it('should return a new function', () => {
        expect(wrappedFunction).to.not.be.equal(functionFixture)
      })

      it('calling the wraping function should call the wrapped function', () => {
        expect(functionFixture.called).to.be.true
      })

      it('return of the wrapping function should be the same as the return of the wrapped function', () => {
        expect(wrappedFunctionReturn).to.be.equal(functionFixture(argA, argB))
      })

      it('should start the profiler sampler', () => {
        expect(Sampler.prototype.start.called).to.be.true
      })

      it('should stop the profiler sampler', () => {
        expect(Sampler.prototype.stop.called).to.be.true
      })
    })

    context('with asynchronous function', () => {
      const argA = 2
      const argB = 3

      let wrappedFunction
      let wrappedFunctionReturn
      before(async () => {
        sinon.stub(Sampler.prototype, 'start')
        sinon.stub(Sampler.prototype, 'stop')
        wrappedFunction = profiler.wrapAsync(asyncFunctionFixture)
        wrappedFunctionReturn = await wrappedFunction(argA, argB)
      })

      after(() => {
        Sampler.prototype.start.restore()
        Sampler.prototype.stop.restore()
      })

      it('should return a new function', () => {
        expect(wrappedFunction).to.not.be.equal(asyncFunctionFixture)
      })

      it('calling the wrap function should call the wrapped function', () => {
        expect(functionFixture.called).to.be.true
      })

      it('return of the wrapping function should be the same as the return of the wrapped function', () => {
        expect(wrappedFunctionReturn).to.be.equal(functionFixture(argA, argB))
      })

      it('should start the profiler sampler', () => {
        expect(Sampler.prototype.start.called).to.be.true
      })

      it('should stop the profiler sampler', () => {
        expect(Sampler.prototype.stop.called).to.be.true
      })
    })
  })
})