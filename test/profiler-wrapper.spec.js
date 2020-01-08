const { expect } = require('chai')
const sinon = require('sinon')

const { ProfilerWrapper } = require('..')
const Sampler = require('../src/sampler')


describe('when using the function wrapper', () => {
  context('with profiler disabled', () => {
    let profiler
    before(() => {
      profiler = new ProfilerWrapper({
        disabled: true
      })
    })

    context('with synchronous function', () => {
      const functionFixture = () => {}
      let wrappedFunction
      before(() => {
        wrappedFunction = profiler.wrap(functionFixture)
      })

      it('should return unaltered function', () => {
        expect(wrappedFunction).to.be.equal(functionFixture)
      })
    })
  
    context('with asynchronous function', () => {
      const functionFixture = async () => {}
      let wrappedFunction
      before(() => {
        wrappedFunction = profiler.wrapAsync(functionFixture)
      })

      it('should return unaltered function', () => {
        expect(wrappedFunction).to.be.equal(functionFixture)
      })
    })
  })

  context('with profiler enabled', () => {
    let profiler
    before(() => {
      profiler = new ProfilerWrapper()
    })

    context('with synchronous function returning properly', () => {
      const functionFixture = sinon.stub().callsFake((a, b) => a+b)
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

      it('calling the wrapping function should call the wrapped function', () => {
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

    context('with synchronous function throwing errors', () => {
      const errorFixture = "error"
      const functionFixture = sinon.stub().callsFake(() => { throw errorFixture })

      let wrappedFunction
      let thrownError
      before(() => {
        sinon.stub(Sampler.prototype, 'start')
        sinon.stub(Sampler.prototype, 'stop')
        wrappedFunction = profiler.wrap(functionFixture)
        try {
          wrappedFunction()
        } catch (err) {
          thrownError = err
        }
      })

      after(() => {
        Sampler.prototype.start.restore()
        Sampler.prototype.stop.restore()
      })

      it('should return a new function', () => {
        expect(wrappedFunction).to.not.be.equal(functionFixture)
      })

      it('calling the wrapping function should call the wrapped function', () => {
        expect(functionFixture.called).to.be.true
      })

      it('error from the wrapped function should be rethrown by the wrapping function', () => {
        expect(thrownError).to.be.equal(errorFixture)
      })

      it('should start the profiler sampler', () => {
        expect(Sampler.prototype.start.called).to.be.true
      })

      it('should stop the profiler sampler', () => {
        expect(Sampler.prototype.stop.called).to.be.true
      })
    })

    context('with asynchronous returning properly function', () => {
      const functionFixture = sinon.stub().callsFake(async (a, b) => a+b)
      const argA = 2
      const argB = 3

      let wrappedFunction
      let wrappedFunctionReturn
      before(async () => {
        sinon.stub(Sampler.prototype, 'start')
        sinon.stub(Sampler.prototype, 'stop')
        wrappedFunction = profiler.wrapAsync(functionFixture)
        wrappedFunctionReturn = await wrappedFunction(argA, argB)
      })

      after(() => {
        Sampler.prototype.start.restore()
        Sampler.prototype.stop.restore()
      })

      it('should return a new function', () => {
        expect(wrappedFunction).to.not.be.equal(functionFixture)
      })

      it('calling the wrap function should call the wrapped function', () => {
        expect(functionFixture.called).to.be.true
      })

      it('return of the wrapping function should be the same as the return of the wrapped function', async () => {
        expect(wrappedFunctionReturn).to.be.equal(await functionFixture(argA, argB))
      })

      it('should start the profiler sampler', () => {
        expect(Sampler.prototype.start.called).to.be.true
      })

      it('should stop the profiler sampler', () => {
        expect(Sampler.prototype.stop.called).to.be.true
      })
    })

    context('with asynchronous throwing errors', () => {
      const errorFixture = "error"
      const functionFixture = sinon.stub().callsFake(async () => { throw errorFixture })

      let thrownError
      let wrappedFunction
      before(async () => {
        sinon.stub(Sampler.prototype, 'start')
        sinon.stub(Sampler.prototype, 'stop')
        wrappedFunction = profiler.wrapAsync(functionFixture)
        try {
          await wrappedFunction()
        } catch (err) {
          thrownError = err
        }
      })

      after(() => {
        Sampler.prototype.start.restore()
        Sampler.prototype.stop.restore()
      })

      it('should return a new function', () => {
        expect(wrappedFunction).to.not.be.equal(functionFixture)
      })

      it('calling the wrapping function should call the wrapped function', () => {
        expect(functionFixture.called).to.be.true
      })

      it('error thrown by the wrapped function should be rethrown by the wrapping function', async () => {
        expect(thrownError).to.be.equal(errorFixture)
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