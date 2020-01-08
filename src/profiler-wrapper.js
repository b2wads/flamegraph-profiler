const nativeCpuProfiler = require('bindings')('native_cpu_profiler')

const Sampler = require('./sampler')


const defaultGlobalConfig = {
  description: 'profile-sample',
  targetScript: 'app.js',
  samplingInterval: 1,
  callback: () => {}
}
let globalConfig = defaultGlobalConfig

class ProfilerWrapper {

  constructor(config) {
    this.config = {
      ...globalConfig,
      ...config
    }
  }

  wrapAsync (asyncFunc) {
    if (this.config.disabled) return asyncFunc
  
    const sampler = new Sampler(this.config)
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
  
  wrap (func) {
    if (this.config.disabled) return func
  
    const sampler = new Sampler(this.config)
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
  ProfilerWrapper
}
