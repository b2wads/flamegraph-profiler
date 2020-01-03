const { expect } = require('chai')
const sinon = require('sinon')

const profiler = require('..')


describe('when using the function wrapper', () => {
  const functionFixture = sinon.stub()
  const asyncFunctionFixture = async () => {
    functionFixture()
  }

  context('with profiler disabled', () => {
    before(() => {
      profiler.changeDefaultConfig({
        disabled: true
      })
    })

    after(() => {
      profiler.resetDefaultConfig()
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
    context('with synchronous function', () => {
      let wrappedFunction
      before(() => {
        sinon.stub(profiler.Sampler.prototype, 'start')
        sinon.stub(profiler.Sampler.prototype, 'stop')
        wrappedFunction = profiler.wrap(functionFixture)
        wrappedFunction()
      })

      after(() => {
        profiler.Sampler.prototype.start.restore()
        profiler.Sampler.prototype.stop.restore()
      })

      it('should return a new function', () => {
        expect(wrappedFunction).to.not.be.equal(functionFixture)
      })

      it('calling the wrap function should call the wrapped function', () => {
        expect(functionFixture.called).to.be.true
      })

      it('should start the profiler sampler', () => {
        expect(profiler.Sampler.prototype.start.called).to.be.true
      })

      it('should stop the profiler sampler', () => {
        expect(profiler.Sampler.prototype.stop.called).to.be.true
      })
    })

    context('with asynchronous function', () => {
      let wrappedFunction
      before(async () => {
        sinon.stub(profiler.Sampler.prototype, 'start')
        sinon.stub(profiler.Sampler.prototype, 'stop')
        wrappedFunction = profiler.wrap(asyncFunctionFixture)
        await wrappedFunction()
      })

      it('should return a new function', () => {
        expect(wrappedFunction).to.not.be.equal(asyncFunctionFixture)
      })

      it('calling the wrap function should call the wrapped function', () => {
        expect(functionFixture.called).to.be.true
      })

      it('should start the profiler sampler', () => {
        expect(profiler.Sampler.prototype.start.called).to.be.true
      })

      it('should stop the profiler sampler', () => {
        expect(profiler.Sampler.prototype.stop.called).to.be.true
      })
    })
  })
})