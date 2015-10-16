module.exports = {
  in: {js: {transformers: ['eslint', {name: 'babel', options: {stage: 0}}]}},
  builds: {
    'src/signal/**/!(cogs).js': 'build/node_modules/signal',
    'src/shared/**/*.js': 'build/node_modules/shared'
  }
};
