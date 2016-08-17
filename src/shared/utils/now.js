import _ from 'underscore';

export default () => {
  if (typeof process !== 'undefined') {
    const [s, ns] = process.hrtime();
    return s + (ns / 1e9);
  }

  if (typeof performance !== 'undefined') return performance.now() / 1000;

  return _.now() / 1000;
};
