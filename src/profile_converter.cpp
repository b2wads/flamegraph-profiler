#include <sstream>
#include "profile_converter.h"
#include "fold_profile.h"

#include <iostream> // debug

using namespace std;
using namespace flamegraph_profiler;
using namespace v8;
using namespace Nan;

profile_converter::profile_converter(v8::CpuProfile* profile, Nan::Callback* callback, const string& root_script) :
	Nan::AsyncWorker(callback, "flamegraph_profiler::profile_converter"),
	profile(profile),
	root_script(root_script)
{}

void profile_converter::Execute() {
	auto sample = profile->GetTopDownRoot();
	auto branches_to_collapse = cut_branches_at_root(sample, root_script);
	for (auto branch : branches_to_collapse) {
		collapse_recursively(folded_profile, branch, "");
	}
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
