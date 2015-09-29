module.exports = {
  in: {js: {transformers: ['eslint', {name: 'babel', options: {stage: 0}}]}},
  builds: {
    'src/server/**/*': 'build/node_modules/server',
    'src/shared/**/*': 'build/node_modules/shared'
  }
};
