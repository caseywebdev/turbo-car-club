var MINIFY = process.env.MINIFY === '1';

module.exports = {
  manifestPath: 'build/client/manifest.json',
  in: {
    vert: {out: 'js', transformers: {name: 'text'}},
    frag: {out: 'js', transformers: {name: 'text'}},
    json: {out: 'js', transformers: {name: 'json'}},
    js: {
      transformers: [].concat(
        {name: 'eslint', only: 'src/**/*.js'},
        {
          name: 'replace',
          options: {
            flags: 'g',
            patterns: {
              __LIVE_RELOAD__: (!MINIFY).toString(),
              __MIN__: MINIFY ? '.min' : '',
              __SIGNAL_URL__: process.env.SIGNAL_URL,
              'process.env.NODE_ENV': MINIFY ? "'production'" : "'development'"
            }
          }
        },
        {
          name: 'babel',
          only: 'src/**/*.js',
          except: 'src/client/init.js',
          options: {presets: ['es2015', 'stage-0', 'react']}
        },
        {
          name: 'concat-commonjs',
          options: {
            entrypoint: 'src/client/index.js',
            extensions: ['js', 'json', 'vert', 'frag'],
            ignore: ['domain']
          }
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
        MINIFY ? {name: 'clean-css', options: {processImport: false}} : []
      )
    }
  },
  builds: {
    'src/client/index.js': 'build/client',
    'src/client/styles/index.scss': 'build/client',
    'src/client/public/**/*': 'build/client'
  }
};
