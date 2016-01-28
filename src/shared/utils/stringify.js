import _ from 'underscore';

const sortObj = obj => {
  if (!_.isObject(obj)) return obj;
  if (_.isArray(obj)) return _.map(obj, sortObj);
  return _.reduce(_.sortBy(_.keys(obj)), (newObj, key) => {
    newObj[key] = sortObj(obj[key]);
    return newObj;
  }, {});
};

export default obj => JSON.stringify(sortObj(obj));
