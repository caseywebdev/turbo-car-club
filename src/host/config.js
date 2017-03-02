import shared from '../shared/config';

const {env} = process;

export default {
  ...shared,
  key: env.KEY,
  name: env.NAME,
  log: {name: 'host'}
};
