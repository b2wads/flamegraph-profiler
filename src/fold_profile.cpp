#include "fold_profile.h"

#include <queue>
#include <iostream>

using namespace v8;
using namespace std;

void flamegraph_profiler::collapse_recursively (stringstream& output, const CpuProfileNode* node, string function_trace, unsigned chars_to_trim) {
	auto cstyle_file_path = node->GetScriptResourceNameStr();
	string file_path(cstyle_file_path);

	if (file_path.length() > chars_to_trim) {
		function_trace += file_path;
		output 
			<< cstyle_file_path+chars_to_trim
			<< " (ln " << node->GetLineNumber() << ") "
			<< node->GetHitCount()
			<< '\n'
		;
		function_trace += ';';
	}

	auto children_count = node->GetChildrenCount();
	for (decltype(children_count) i = 0; i < children_count; i++) {
		collapse_recursively(output, node->GetChild(i), function_trace, chars_to_trim);
	}
}

bool is_script(const CpuProfileNode* node, const string& script) {
	string file_path(node->GetScriptResourceNameStr());
	if (file_path.length() >= script.length()) {
		return file_path.compare(file_path.length()-script.length(), script.length(), script) == 0;
	}
	return false;
}

list<const CpuProfileNode*> flamegraph_profiler::cut_branches_at_root(const CpuProfileNode* node, const string& root_script) {
	list<const CpuProfileNode*> branches_starting_from_root;
	queue<const CpuProfileNode*> nodes_to_visit;

	nodes_to_visit.push(node);
	while(!nodes_to_visit.empty()) {
		auto visiting_node = nodes_to_visit.front();
		nodes_to_visit.pop();
		if (is_script(visiting_node, root_script)) {
			branches_starting_from_root.push_back(visiting_node);
		} else {
			auto children_count = visiting_node->GetChildrenCount();
			for (decltype(children_count) i = 0; i < children_count; i++) {
				nodes_to_visit.push(visiting_node->GetChild(i));
			}
		}
	}

	return branches_starting_from_root;
}
