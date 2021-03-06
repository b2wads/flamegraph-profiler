#include <v8-profiler.h>
#include <future>
#include "cpu_profiler.h"
#include "profile_converter.h"

using namespace v8;
using namespace Nan;
using namespace std;

// TODO needs to dispose this profiler
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
	auto title = function[0].As<String>();
	v8_profiler->StartProfiling(title);
}

void flamegraph_profiler::stop(const Nan::FunctionCallbackInfo<Value>& function) {
	Nan::HandleScope scope;
	auto title = function[0].As<String>();
	string root_script(*Nan::Utf8String(function[1]));
	unsigned chars_to_trim = Nan::To<unsigned>(function[2]).ToChecked();
	auto callback = function[3].As<Function>();

	Nan::AsyncQueueWorker(new profile_converter(
		v8_profiler->StopProfiling(title),
		new Nan::Callback(callback),
		root_script,
		chars_to_trim
	));
}
