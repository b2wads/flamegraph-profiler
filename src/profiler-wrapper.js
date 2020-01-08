const nativeCpuProfiler = require('bindings')('native_cpu_profiler')

const Sampler = require('./sampler')


const initialConfig = {
  targetScript: '',
  samplingInterval: 1,
  callback: () => {}
}
let globalConfig = initialConfig

const wrapAsync = (asyncFunc, config) => {
  const finalConfig = {
    ...globalConfig,
    ...config
  }

  if (finalConfig.disabled) return asyncFunc

  sampler = new Sampler(finalConfig)
  return async (...args) => {
    sampler.start()
    try {
      await asyncFunc(...args)
    } catch (err) {
      throw err
    } finally {
      sampler.stop()
    }
  }
}

const wrap = (func, config) => {
  const finalConfig = {
    ...globalConfig,
    ...config
  }

  if (finalConfig.disabled) return func

  sampler = new Sampler(finalConfig)
  return (...args) => {
    sampler.start()
    try {
      func(...args)
    } catch (err) {
      throw err
    } finally {
      sampler.stop()
    }
  }
}

const changeGlobalConfig = config => {
  globalConfig = { 
    ...globalConfig,
    ...config
  }
  if (config.tickInterval)
    nativeCpuProfiler.setSamplingInterval(config.tickInterval)
}

const resetGlobalConfig = () => {
  globalConfig = initialConfig
}

module.exports = {
  changeGlobalConfig,
  resetGlobalConfig,
  wrapAsync,
  wrap
}
