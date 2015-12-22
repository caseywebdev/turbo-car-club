import config from 'client/config';

const {prefix} = config.db;

export default {
  get: key => JSON.parse(localStorage[[prefix, key].join(':')] || null),
  set: (key, val) => localStorage[[prefix, key].join(':')] = JSON.stringify(val)
};
