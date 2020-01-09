#pragma once

#include <nan.h>

namespace flamegraph_profiler {
	void Initialize(v8::Local<v8::Object> exports);

	void setSamplingInterval(const Nan::FunctionCallbackInfo<v8::Value>& args);
	void start(const Nan::FunctionCallbackInfo<v8::Value>& args);
	void stop(const Nan::FunctionCallbackInfo<v8::Value>& args);

	NODE_MODULE(cpu_profiler, Initialize);
}
