const {env} = process;
const MINIFY = env.MINIFY === '1';
const ONLY_PUBLIC = env.ONLY_PUBLIC === '1';

const PUBLIC = {
  transformers: [
    {
      name: 'replace',
      only: 'src/client/public/index.html',
      options: {
        flags: 'g',
        patterns: {
          'process.env.(\\w+)': (_, key) => JSON.stringify(process.env[key])
        }
      }
    },
    {name: 'imagemin', only: '**/*.svg', options: {plugins: {svgo: {}}}}
  ],
  builds: {'src/client/public/**/*': {dir: 'build/client'}}
};

const SERVER = {
  transformers: [
    'eslint',
    {name: 'babel', options: {presets: ['es2015', 'stage-0']}}
  ],
  builds: {'src/+(host|signal|shared)/**/*.js': {dir: 'build'}}
};

const STYLES = {
  transformers: [].concat(
    {name: 'stylelint', only: 'src/**/*.scss', options: {syntax: 'scss'}},
    {name: 'directives', only: 'src/**/*.scss'},
    {name: 'sass', only: '**/*.scss'},
    {name: 'autoprefixer'},
    {name: 'local-css', options: {base: 'src/client/styles', debug: !MINIFY}},
    MINIFY ? {
      name: 'clean-css',
      only: '**/*.+(scss|css)',
      options: {processImport: false}
    } : []
  ),
  builds: {
    'src/client/styles/index.scss': 'build/client/index.css'
  }
};

const CLIENT = {
  transformers: [].concat(
    {name: 'sass', only: '**/*.scss'},
    {
      name: 'local-css',
      only: 'src/**/*.scss',
      options: {base: 'src/client/styles', debug: !MINIFY, export: true}
    },
    {name: 'eslint', only: 'src/**/*.js'},
    {
      name: 'replace',
      only: '**/*.js',
      options: {
        flags: 'g',
        patterns: {
          'process.env.NODE_ENV': MINIFY ? "'production'" : "'development'"
        }
      }
    },
    {name: 'text', only: '**/*.+(frag|vert)'},
    {name: 'json', only: '**/*.+(json|scss)'},
    {
      name: 'babel',
      only: ['src/**/*.+(js|json|frag|vert|scss)'],
      options: {presets: ['es2015', 'stage-0', 'react']}
    },
    {
      name: 'concat-commonjs',
      only: '**/*.+(js|json|vert|frag|scss)',
      options: {
        entry: 'src/client/index.js',
        extensions: ['.js', '.json', '.vert', '.frag', '.scss']
      }
    },
    MINIFY ? {
      name: 'uglify-js',
      only: '**/*.+(js|json|vert|frag|scss)',
      except: ['**/*+(-|_|.)min.js', 'node_modules/ammo.js/ammo.js']
    } : []
  ),
  builds: {
    'src/client/index.js': 'build/client/index.js'
  }
};

module.exports = ONLY_PUBLIC ? [PUBLIC] : [CLIENT, PUBLIC, SERVER, STYLES];
