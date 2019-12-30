#include <sstream>
#include "profile_converter.h"

#include <iostream> // debug

using namespace std;
using namespace flamegraph_profiler;
using namespace v8;
using namespace Nan;

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

profile_converter::profile_converter(v8::CpuProfile* profile, Nan::Callback* callback) :
	Nan::AsyncWorker(callback),
	profile(profile)
{}

void profile_converter::Execute() {
	collapse_in_flamegraph_recursively(folded_profile, profile->GetTopDownRoot(), "");
}

void profile_converter::HandleOKCallback() {
	Nan::HandleScope scope;
	profile->Delete();
	v8::Local<v8::Value> callback_args[] = {
		Nan::Null(),
		Nan::New(folded_profile.str()).ToLocalChecked()
	};
	Call(callback->GetFunction(), Nan::GetCurrentContext()->Global(), 2, callback_args);
}

void profile_converter::HandleErrorCallback() {
	Nan::HandleScope scope;
	profile->Delete();
	v8::Local<v8::Value> callback_args[] = {
		Nan::New(ErrorMessage()).ToLocalChecked(),
		Nan::Null()
	};
	Call(callback->GetFunction(), Nan::GetCurrentContext()->Global(), 2, callback_args);
}
