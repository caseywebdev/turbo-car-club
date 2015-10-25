import shared from 'shared/config';

export default {
  ...shared,
  store: {
    prefix: 'tcc'
  },
  signal: {
    url: 'ws://docker:1337'
  }
};
