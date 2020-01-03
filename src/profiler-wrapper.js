const path = require('path')
const nativeCpuProfiler = require('bindings')('native_cpu_profiler')

const projectRootPrefixSize = path.normalize(`${__dirname}/../..`).length


const initialConfig = {
  targetedScript: '',
  samplingInterval: 1,
  callback: () => {}
}
let defaultConfig = initialConfig

class Sampler {
  constructor({
    description,
    targetScript,
    samplingInterval,
    callback
  }) {
    if (description) {
      this.description = description
    } else {
      this.description = callback.name
    }
    this.targetScript = targetScript
    this.samplingInterval = samplingInterval
    this.callback = callback
    this.callCounter = 0
  }

  start() {
    this.callCounter++
    if (this.callCounter === this.samplingInterval) {
      nativeCpuProfiler.start()
    }
  }

  stop() {
    if (this.callCounter === this.samplingInterval) {
      nativeCpuProfiler.stop(
        this.description,
        this.targetedScript,
        projectRootPrefixSize,
        this.callback
      )

      this.callCounter = 0
    }
  }
}

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
  Sampler,
  changeDefaultConfig,
  resetDefaultConfig,
  wrapAsync,
  wrap
}
