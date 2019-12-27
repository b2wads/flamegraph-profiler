#include <v8-profiler.h>
#include <future>
#include "cpu_profiler.h"
#include "profile_converter.h"

using namespace v8;
using namespace Nan;
using namespace std;

CpuProfiler* v8_profiler = CpuProfiler::New(Isolate::GetCurrent());

void flamegraph_profiler::Initialize (Local<Object> exports) {
	using namespace flamegraph_profiler;
	NAN_EXPORT(exports, setSamplingInterval);
	NAN_EXPORT(exports, start);
	NAN_EXPORT(exports, stop);
}

void flamegraph_profiler::setSamplingInterval(const Nan::FunctionCallbackInfo<Value>& function) {
	auto samplingInterval = Nan::To<int>(function[0]).ToChecked();
	v8_profiler->SetSamplingInterval(samplingInterval);
}

void flamegraph_profiler::start(const Nan::FunctionCallbackInfo<Value>& function) {
	auto title = Nan::To<String>(function[0]).ToLocalChecked();
	v8_profiler->StartProfiling(title);
}

void flamegraph_profiler::stop(const Nan::FunctionCallbackInfo<Value>& function) {
	auto isolate = function.GetIsolate();
	auto title = Nan::To<String>(function[0]).ToLocalChecked();
	auto callbackFunction = Nan::To<Function>(function[1]);

	async([=] () mutable {
		// TODO this instantiation segfaults
		Nan::Callback callback(callbackFunction.ToLocalChecked());
	
    	auto profile = v8_profiler->StopProfiling(title);
		auto foldedProfile = collapse_in_flamegraph(profile);
		profile->Delete();

		Local<String> externalFoldedProfile = String::NewFromUtf8(
			isolate,
			foldedProfile.c_str(),
			NewStringType::kNormal
		).ToLocalChecked();

		Local<Value> callbackArgs[] = { externalFoldedProfile };
		Call(callback, 1, callbackArgs);
	});
}
