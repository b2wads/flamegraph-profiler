#include <sstream>
#include "profile_converter.h"

using namespace std;

void collapse_in_flamegraph_recursively(stringstream& output, const v8::CpuProfileNode* node, string functionTrace) {
	string filePath(node->GetScriptResourceNameStr());

	if (!filePath.empty()) {
		functionTrace += ';';
		functionTrace += filePath;
		output 
			<< functionTrace
			<< " (ln " << node->GetLineNumber() << ") "
			<< node->GetHitCount()
			<< '\n'
		;
	}

	auto childrenCount = node->GetChildrenCount();
	for (decltype(childrenCount) i = 0; i < childrenCount; i++) {
		collapse_in_flamegraph_recursively(output, node->GetChild(i), functionTrace);
	}
}

string flamegraph_profiler::collapse_in_flamegraph(const v8::CpuProfile *node) {
	stringstream string_builder;
	collapse_in_flamegraph_recursively(string_builder, node->GetTopDownRoot(), "");
	return string_builder.str();
}