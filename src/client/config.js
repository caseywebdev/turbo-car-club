import shared from '../shared/config';

export default {
  ...shared,
  disk: {
    prefix: 'tcc'
  },
  signal: {
    url: window.SIGNAL_URL
  }
};
