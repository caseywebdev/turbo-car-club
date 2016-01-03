import _ from 'underscore';

const LOADING = {};

const data = {
  users: {
    1: {
      id: 1,
      name: 'THE NEWBY'
    }
  },
  hosts: [
    {
      user: {$ref: ['users', 1]},
      region: 'Local',
      name: 'Host'
    }
  ],
  usersByAuth: {$ref: ['users', 1]}
};

// const router = {
//   hosts: cb => {
//
//   }
// };

const pairAndSort = segment => {
  if (!_.isObject(segment)) return segment;
  if (_.isArray(segment)) return _.map(segment, pairAndSort);
  return _.sortBy(_.map(segment, (val, key) => [key, pairAndSort(val)]), 0);
};

const stringifySegment = segment => {
  if (!_.isObject(segment)) return '' + segment;
  return JSON.stringify(pairAndSort(segment));
};

const resolveRefs = obj => {
  if (!_.isObject(obj)) return obj;
  if (_.isArray(obj)) return _.map(obj, resolveRefs);
  if (obj.$ref) return get(obj.$ref);
  return _.mapObject(obj, resolveRefs);
};

const get = path => {
  const keys = _.map(path, stringifySegment);
  let val = data;
  for (let i = 0; i < keys.length && val != null; ++i) {
    val = resolveRefs(val[keys[i]]);
  }
  return val;
};

const isLoading = path => get(path) === LOADING;

export default {get, isLoading};
