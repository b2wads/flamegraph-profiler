# FlameGraph Profiler

This library provides a simple interface for continuously profiling CPU hotspots of Node.js applications using the V8 Profiler. Profiles are generated in folded FlameGraph format for easy visualization.

## Usage Overview

```JavaScript
const cpuProfiler = require('flamegraph-profiler')

const functionToProfile = () => {
  // does something
}

const profilableFunction = cpuProfiler.wrap(functionToProfile)
```

## Available Methods

### wrap(func[, config])

Retuns a function which decorates _func_. When the returned function is called it will forward the call to _func_ and profile it according to _config_.

- __arguments__
  - _func_: the function to be wrapped
  - _config_: object containing the configurations to use. Any configurations not specified will be set to their default configuration. See section [configurations]() for details

### wrapAsync(asyncFunc[, config])

Retuns an asynchronous function which decorates _asyncFunc_. When the returned function is called it will forward the call to _asyncFunc_ and profile it according to _config_.

- __arguments__
  - _asyncFunc_: asynchronous function to be wrapped
  - _config_: object containing the configurations to use. Any configurations not specified will be set to their default configuration. See section [configurations]() for details

### changeDefaultConfig(config)

Changes the default configurations used by _wrap()_ and _wrapAsync()_. This function returns _undefined_

- __arguments__
  - _config_: object containing configurations to change. Configurations not present in this argument retain their previous value. See section [configurations]() for details

### resetDefaultConfig()

Sets all default configurations to their initial values. This function retuns _undefined_ and takes no arguments.

## Configurations

- `description`: string describing what is being profiled
- `targetScript`: path to a source file (relative to the project root). The profiler will filter metrics from the V8 Profiler to only include stacks starting from the target script
- `samplingInterval`: interval at which the function should be profiled, in number of function calls. Eg.: if this configuration is set to 100 a profile sample will be collected every 100 function calls
- `callback`: method to execute after a profile sample is collected. This function should take an error as a first argument and a string as a second argument. The second argument will contain the collected metrics in folded FlameGraph format
- `tickInterval`: can only be set as a default configuration. Specifies the tick interval of the V8 Profiler
