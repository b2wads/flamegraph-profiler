#pragma once

#include <string>
#include <v8-profiler.h>
#include <nan.h>
#include <sstream>

namespace flamegraph_profiler {
	class profile_converter : public Nan::AsyncWorker {
		private:
			v8::CpuProfile* profile;
			std::string root_script;
			std::stringstream folded_profile;

		public:
			profile_converter(v8::CpuProfile* profile, Nan::Callback* callback, const std::string& root_script);

			void Execute();
			void HandleOKCallback();
			void HandleErrorCallback();
	};
}
