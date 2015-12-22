import shared from 'shared/config';

export default {
  ...shared,
  db: {
    prefix: 'tcc'
  },
  signal: {
    url: '__SIGNAL_URL__'
  }
};
