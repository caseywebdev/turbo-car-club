import config from 'client/config';

const {prefix} = config.store;

export const get = key =>
  JSON.parse(localStorage[[prefix, key].join(':')] || null);

export const set = (key, val) =>
  localStorage[[prefix, key].join(':')] = JSON.stringify(val);
