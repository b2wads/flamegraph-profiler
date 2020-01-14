const path = require('path')

const nativeCpuProfiler = require('bindings')('native_cpu_profiler')

const projectRootPrefixSize = path.normalize(`${__dirname}/../..`).length + 1

class Sampler {
  constructor({ description, targetScript, samplingInterval, callback }) {
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
    this.callCounter += 1
    if (this.callCounter === this.samplingInterval) {
      nativeCpuProfiler.start(this.description)
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

module.exports = Sampler
