#pragma once

#include <string>
#include <v8-profiler.h>

namespace flamegraph_profiler {
	std::string collapse_in_flamegraph(const v8::CpuProfile* profile);
}
