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
          except: 'src/client/init.js',
          options: {modules: 'amd', stage: 0}
        },
        {
          name: 'concat-amd',
          options: {base: 'src', extensions: ['js', 'vert', 'frag']}
        },
        MINIFY ? {name: 'uglify-js', except: '**/*+(-|_|.)min.js'} : [],
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
    'src/styles/index.scss': 'public'
  }
};
