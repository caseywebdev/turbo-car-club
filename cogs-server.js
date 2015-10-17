module.exports = {
  manifestPath: 'build/node_modules/manifest.json',
  in: {js: {transformers: ['eslint', {name: 'babel', options: {stage: 0}}]}},
  builds: {'src/+(host|signal|shared)/**/*.js': 'build/node_modules'}
};
