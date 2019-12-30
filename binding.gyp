{
  'targets': [
    {
      'target_name': 'cpu_profiler',
      'win_delay_load_hook': 'false',
      'sources': [
        'src/cpu_profiler.cpp',
        'src/profile_converter.cpp',
        'src/fold_profile.cpp'
      ],
      'include_dirs' : [
        "<!(node -e \"require('nan')\")"
      ]
    }
  ]
}
