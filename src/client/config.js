import shared from '../shared/config';

export default {
  ...shared,
  disk: {
    namespace: 'tcc'
  },
  signal: {
    url: window.SIGNAL_URL
  },
  livereload: {
    url: window.LIVERELOAD_URL
  }
};
