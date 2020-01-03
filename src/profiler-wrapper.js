const nativeCpuProfiler = require('bindings')('native_cpu_profiler')

const Sampler = require('./sampler')


const initialConfig = {
  targetScript: '',
  samplingInterval: 1,
  callback: () => {}
}
let defaultConfig = initialConfig

const wrapAsync = (asyncFunc, config) => {
  const finalConfig = {
    ...defaultConfig,
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
    ...defaultConfig,
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

const changeDefaultConfig = config => {
  defaultConfig = { 
    ...defaultConfig,
    ...config
  }
  if (config.tickInterval)
    nativeCpuProfiler.setSamplingInterval(config.tickInterval)
}

const resetDefaultConfig = () => {
  defaultConfig = initialConfig
}

const getDefaultConfig = () => {
  return { ...defaultConfig }
}

module.exports = {
  changeDefaultConfig,
  resetDefaultConfig,
  wrapAsync,
  wrap
}
