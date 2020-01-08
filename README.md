# FlameGraph Profiler

This library provides a simple interface for continuous profiling of CPU hotspots in Node.js applications. The profiling is done using the V8 Profiler and collected metrics are made available in folded [FlameGraph](https://github.com/brendangregg/FlameGraph) format.

## Profiling Functions

Functions can be profiled by using the provided wrapper to decorate them (see the [decorator pattern](https://en.wikipedia.org/wiki/Decorator_pattern) for details). The decorated function will then forward all calls to the original function and profile it according to the defined configurations.

For improved performance, functions are only profiled every _n_ calls with each profiled call constituting a sample. The collected information is made available in folded [FlameGraph](https://github.com/brendangregg/FlameGraph) format and metrics from multiple samples can be trivially summarized by concatenating them.

The following is an overview on the usage of the wrapper and detailed documentation on the available methods:

```JavaScript
const { ProfilerWrapper } = require('flamegraph-profiler')

const profiler = new ProfilerWrapper()

const functionToProfile = () => {
  console.log("Hello World!")
}

const profilableFunction = profiler.wrap(functionToProfile)

profilableFunction() // will print 'Hello World!'
```

### constructor([config])

Instantiates a new wrapper which creates all decorated functions using the same configuration.

- __arguments__
  - _config_: local configuration to use when decorating functions. See section [configurations](#configurations) for details

### wrap(func)

Retuns a function which decorates _func_. When the decorating function is called it will forward the call to _func_ and profile it according to the previously defined configurations.

- __arguments__
  - _func_: the function to be decorated

### wrapAsync(asyncFunc)

Retuns an asynchronous function which decorates _asyncFunc_. When the decorating function is called it will forward the call to _asyncFunc_ and profile it according to the previously defined configurations.

- __arguments__
  - _asyncFunc_: asynchronous function to be decorated

## Exporting Metrics

Metrics can be exported through a callback function defined by the `callback` configuration parameter. This function will be called after the profiling of every sample.

The callback should take 2 ordered arguments:

1. object describing an error. This argument will be _null_ if there were no errors
2. string containing all collected metrics in folded [FlameGraph](https://github.com/brendangregg/FlameGraph) format

The following is an example on how to configure the callback function:

```JavaScript
const { ProfilerWrapper } = require('flamegraph-profiler')

const profiler = new ProfilerWrapper({
  callback: (err, sampleMetrics) => {
    if (!err) console.log(sampleMetrics)
    else console.error(err)
  }
})
```

## Configurations

There are two types of configurations: the _global configuration_ and _local configurations_. Parameters of local configurations individually shadow parameters of the global configuration.

The following parameters are available:

- `description`: string describing what is being profiled. The global default is 'profile-sample'
- `targetScript`: path to a source file (relative to the project root). The profiler will filter metrics from the V8 Profiler to only include stacks starting from the target script. The global default is 'app.js'
- `samplingInterval`: interval at which the function should be profiled, in number of function calls. Eg.: if the _samplingInterval_ is set to 100 a sample will be profiled every 100 function calls. The global default is 1
- `callback`: function to execute after a profile sample is collected. The global default is a function which does nothing. See section [Exporting Metrics](#exporting-metrics) for details
- `tickInterval`: specifies the tick interval of the V8 Profiler, in microsseconds. Can only be set globaly as this is a configuration of the V8 Profiler itself. The default is 1000us

The following functions can be used to edit the global configuration:

### changeGlobalConfig(config)

Changes the global configuration. Does not return anything

- __arguments__
  - _config_: object containing parameters to change. Parameters not present in this argument retain their previous value

### resetGlobalConfig()

Resets all parameters in the global configuration to their default values. Does not return anything
