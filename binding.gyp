{
  'targets': [
    {
      'target_name': 'native_cpu_profiler',
      'win_delay_load_hook': 'false',
      'sources': [
        'src/native/cpu_profiler.cpp',
        'src/native/profile_converter.cpp',
        'src/native/fold_profile.cpp'
      ],
      'include_dirs' : [
        "<!(node -e \"require('nan')\")"
      ]
    }
  ]
}
