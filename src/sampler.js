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

module.exports = Sampler