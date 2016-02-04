import _ from 'underscore';

const sortObj = obj =>
  _.isArray(obj) ? _.map(obj, sortObj) :
  _.isObject(obj) ? _.sortBy(_.map(obj, (val, key) => [key, sortObj(val)]), 0) :
  obj;

export default obj => _.isObject(obj) ? JSON.stringify(sortObj(obj)) : obj;
