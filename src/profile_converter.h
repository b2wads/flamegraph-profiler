#pragma once

#include <string>
#include <v8-profiler.h>
#include <nan.h>
#include <sstream>

namespace flamegraph_profiler {
	class profile_converter : public Nan::AsyncWorker {
		private:
			v8::CpuProfile* profile;
			std::stringstream folded_profile;

		public:
			profile_converter(v8::CpuProfile* profile, Nan::Callback* callback);

			void Execute();
			void HandleOKCallback();
			void HandleErrorCallback();
	};
}
