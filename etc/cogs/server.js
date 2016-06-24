module.exports = {
  manifestPath: 'build/manifest-server.json',
  pipe: [
    'eslint',
    {
      name: 'replace',
      only: '**/*.js',
      options: {flags: 'g', patterns: {__VERSION__: process.env.VERSION}}
    },
    {name: 'babel', options: {presets: ['es2015', 'stage-0']}}
  ],
  builds: {'src/+(host|signal|shared)/**/*.js': {dir: 'build'}}
};
