'use strict';

const MINIFY = process.env.MINIFY === '1';

module.exports = {
  manifestPath: 'build/manifest-client.json',
  pipe: [].concat(
    {name: 'eslint', only: 'src/**/*.js'},
    {name: 'scss-lint', only: '**/*.scss'},
    {name: 'directives', only: 'src/**/*.+(js|scss)'},
    {
      name: 'replace',
      only: '**/*.js',
      options: {
        flags: 'g',
        patterns: {
          __LIVERELOAD__: (!MINIFY).toString(),
          __MIN__: MINIFY ? '.min' : '',
          __SIGNAL_URL__: process.env.SIGNAL_URL,
          'process.env.NODE_ENV': MINIFY ? "'production'" : "'development'"
        }
      }
    },
    {
      name: 'babel',
      only: 'src/**/*.js',
      options: {
        presets: ['es2015', 'stage-0', 'react'],
        plugins: [
          require('babel-relay-plugin')(
            require('./build/shared/data/schema.json'),
            {abortOnError: true}
          )
        ]
      }
    },
    {name: 'text', only: '**/*.+(frag|vert)', ext: '.js'},
    {name: 'json', only: '**/*.json', ext: '.js'},
    {
      name: 'concat-commonjs',
      only: '**/*.js',
      options: {
        entrypoint: 'src/client/index.js',
        extensions: ['.js', '.json', '.vert', '.frag'],
        ignore: ['domain']
      }
    },
    MINIFY ? {
      name: 'uglify-js',
      only: '**/*.js',
      except: ['**/*+(-|_|.)min.js', 'node_modules/ammo.js/ammo.js']
    } : [],
    {name: 'sass', only: '**/*.scss', ext: '.css'},
    {
      name: 'local-css',
      only: 'src/**/*.css',
      options: {
        base: 'src/client/styles',
        debug: !MINIFY,
        target: 'src/client/class-names.json'
      }
    },
    {name: 'autoprefixer', only: '**/*.css'},
    MINIFY ? {
      name: 'clean-css',
      only: '**/*.css',
      options: {processImport: false}
    } : []
  ),
  builds: {
    'src/client/index.js': 'build/client',
    'src/client/styles/index.scss': 'build/client',
    'src/client/public/**/*': 'build/client'
  }
};
