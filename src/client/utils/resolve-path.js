import _ from 'underscore';
import stringify from '../../shared/utils/stringify';

const resolvePath = (path, prefix = []) => {
  if (!path.length) return [prefix];

  let [first, rest] = [_.first(path), _.rest(path)];

  if (_.isArray(first)) {
    return _.reduce(first, (paths, path) =>
      paths.concat(resolvePath(prefix.concat(path, rest)))
    , []);
  }

  const $type = first && first.$type;

  if ($type === 'join') {
    return _.reduce(first.value, (paths, path, key) =>
      paths.concat(resolvePath(prefix.concat(key, path, rest)))
    , []);
  }

  if ($type === 'params') first = stringify(first.value);

  return resolvePath(rest, prefix.concat(first));
};

export default resolvePath;
