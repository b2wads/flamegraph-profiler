#pragma once

#include <v8-profiler.h>
#include <list>
#include <sstream>

namespace flamegraph_profiler {
	void collapse_recursively (std::stringstream& output, const v8::CpuProfileNode* node, std::string function_trace);
	std::list<const v8::CpuProfileNode*> cut_branches_at_root(const v8::CpuProfileNode* node, const std::string& root);
}
