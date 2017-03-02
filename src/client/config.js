import shared from '../shared/config';

const {env} = window;

export default {
  ...shared,
  disk: {
    namespace: 'tcc'
  },
  livereload: {
    url: env.LIVERELOAD_URL
  }
};
