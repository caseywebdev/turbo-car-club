'use strict';

const ENV = process.env;
const MINIFY = ENV.MINIFY === '1';
const ONLY_CLASS_NAMES = ENV.ONLY_CLASS_NAMES === '1';

const TARGET = {
  dir: 'build/client',
  ext: {
    '.json': '.js',
    '.frag': '.js',
    '.vert': '.js',
    '.scss': '.css'
  }
};

const CLASS_NAMES_BUILDS = {
  'src/client/styles/index.scss': TARGET
};

const OTHER_BUILDS = {
  'src/client/index.js': TARGET,
  'src/client/public/**/*': TARGET
};

const BUILDS = Object.assign(
  {},
  CLASS_NAMES_BUILDS,
  ONLY_CLASS_NAMES ? {} : OTHER_BUILDS
);

module.exports = {
  manifestPath: 'build/manifest-client.json',
  pipe: [].concat(
    {name: 'eslint', only: 'src/**/*.js'},
    {name: 'sass-lint', only: '**/*.scss'},
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
    {name: 'text', only: '**/*.+(frag|vert)'},
    {name: 'json', only: '**/*.json'},
    {
      name: 'babel',
      only: 'src/**/*.+(js|json|frag|vert)',
      options: {
        presets: ['es2015', 'stage-0', 'react'],
        plugins: [
          require('babel-relay-plugin')(
            require('./src/signal/data/schema.json'),
            {abortOnError: true}
          )
        ]
      }
    },
    {
      name: 'concat-commonjs',
      only: '**/*.+(js|json|vert|frag)',
      options: {
        entry: 'src/client/index.js',
        extensions: ['.js', '.json', '.vert', '.frag'],
        ignore: ['domain']
      }
    },
    MINIFY ? {
      name: 'uglify-js',
      only: '**/*.+(js|json|vert|frag)',
      except: ['**/*+(-|_|.)min.js', 'node_modules/ammo.js/ammo.js']
    } : [],
    {name: 'sass', only: '**/*.scss'},
    {
      name: 'local-css',
      only: 'src/**/*.+(scss|css)',
      options: {
        base: 'src/client/styles',
        debug: !MINIFY,
        target: 'src/client/class-names.json'
      }
    },
    {name: 'autoprefixer', only: '**/*.+(scss|css)'},
    MINIFY ? {
      name: 'clean-css',
      only: '**/*.+(scss|css)',
      options: {processImport: false}
    } : []
  ),
  builds: BUILDS
};
