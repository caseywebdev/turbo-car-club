module.exports = {
  in: {js: {transformers: ['eslint', {name: 'babel', options: {stage: 0}}]}},
  builds: {
    'src/host/**/!(cogs).js': 'build/node_modules/host',
    'src/shared/**/*.js': 'build/node_modules/shared'
  }
};
