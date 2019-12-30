#include "fold_profile.h"

using namespace v8;
using namespace std;

void flamegraph_profiler::collapse_recursively (stringstream& output, const CpuProfileNode* node, string function_trace) {
	string file_path(node->GetScriptResourceNameStr());

	if (!file_path.empty()) {
		function_trace += file_path;
		output 
			<< function_trace
			<< " (ln " << node->GetLineNumber() << ") "
			<< node->GetHitCount()
			<< '\n'
		;
		function_trace += ';';
	}

	auto children_count = node->GetChildrenCount();
	for (decltype(children_count) i = 0; i < children_count; i++) {
		collapse_recursively(output, node->GetChild(i), function_trace);
	}
}
