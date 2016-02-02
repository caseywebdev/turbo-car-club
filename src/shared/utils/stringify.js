import _ from 'underscore';

const sortObj = obj =>
  _.isArray(obj) ? _.map(obj, sortObj) :
  _.isObject(obj) ? _.sortBy(_.pairs(_.mapObject(obj, sortObj)), 0) :
  obj;

export default obj => JSON.stringify(sortObj(obj));
