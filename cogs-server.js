module.exports = {
  manifestPath: 'build/manifest-server.json',
  pipe: ['eslint', {name: 'babel', options: {presets: ['es2015', 'stage-0']}}],
  builds: {'src/+(host|signal|shared)/**/*.js': 'build'}
};
