import shared from '../shared/config';

const {env} = window;

export default {
  ...shared,
  disk: {
    namespace: 'tcc'
  },
  signal: {
    url: env.SIGNAL_URL
  },
  livereload: {
    url: env.LIVERELOAD_URL
  }
};
