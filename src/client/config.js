import shared from 'shared/config';

export default {
  ...shared,
  store: {
    prefix: 'tcc'
  },
  signal: {
    url: '__SIGNAL_URL__'
  }
};
