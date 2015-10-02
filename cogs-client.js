var MINIFY = !!process.env.MINIFY;

module.exports = {
  manifestPath: 'public/manifest.json',
  in: {
    vert: {out: 'js', transformers: 'text'},
    frag: {out: 'js', transformers: 'text'},
    js: {
      transformers: [].concat(
        'eslint',
        'directives',
        {
          name: 'babel',
          only: 'src/**/*.js',
          except: ['src/client/init.js', 'src/client/init-worker.js'],
          options: {modules: 'amd', stage: 0}
        },
        {
          name: 'concat-amd',
          options: {base: 'src', extensions: ['js', 'vert', 'frag']}
        },
        MINIFY ? {
          name: 'uglify-js',
          except: ['**/*+(-|_|.)min.js', 'node_modules/ammo.js/ammo.js']
        } : [],
        {name: 'replace', options: {patterns: {__DEV__: (!MINIFY).toString()}}}
      )
    },
    scss: {
      out: 'css',
      transformers: [].concat('directives', 'sass', MINIFY ? 'csso' : [])
    }
  },
  builds: {
    'src/client/index.js': 'public',
    'src/client/worker.js': 'public',
    'src/styles/index.scss': 'public'
  }
};
