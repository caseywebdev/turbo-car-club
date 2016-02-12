import config from '../config';

const {prefix} = config.disk;

export default {
  get: key => JSON.parse(localStorage[[prefix, key].join(':')] || null),
  set: (key, val) => localStorage[[prefix, key].join(':')] = JSON.stringify(val)
};
