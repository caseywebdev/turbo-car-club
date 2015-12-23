var MINIFY = process.env.MINIFY === '1';

module.exports = {
  manifestPath: 'build/client/manifest.json',
  in: {
    vert: {out: 'js', transformers: {name: 'text', options: {modules: 'amd'}}},
    frag: {out: 'js', transformers: {name: 'text', options: {modules: 'amd'}}},
    json: {out: 'js', transformers: {name: 'json', options: {modules: 'amd'}}},
    js: {
      transformers: [].concat(
        {name: 'eslint', only: 'src/**/*.js'},
        {
          name: 'replace',
          options: {
            patterns: {
              __DEV__: (!MINIFY).toString(),
              __MIN__: MINIFY ? '.min' : '',
              __SIGNAL_URL__: process.env.SIGNAL_URL
            }
          }
        },
        'directives',
        {
          name: 'babel',
          only: 'src/**/*.js',
          except: 'src/client/init.js',
          options: {modules: 'amd', stage: 0}
        },
        {
          name: 'concat-amd',
          options: {base: 'src', extensions: ['js', 'json', 'vert', 'frag']}
        },
        MINIFY ? {
          name: 'uglify-js',
          except: ['**/*+(-|_|.)min.js', 'node_modules/ammo.js/ammo.js']
        } : []
      )
    },
    scss: {
      out: 'css',
      transformers: [].concat(
        'scss-lint',
        'directives',
        'sass',
        {
          name: 'local-css',
          except: 'node_modules/**/*',
          options: {
            base: 'src/client/styles',
            debug: !MINIFY,
            target: 'src/client/class-names.json'
          }
        },
        'autoprefixer',
        MINIFY ? 'csso' : []
      )
    }
  },
  builds: {
    'src/client/index.js': 'build/client',
    'src/client/styles/index.scss': 'build/client',
    'src/client/public/**/*': 'build/client'
  }
};
