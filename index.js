const pack = require('./package.json');
const cpuProfiler = require('bindings')('cpu_profiler');

module.exports = {
  cpuProfiler
}