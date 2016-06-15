import _ from 'underscore';
import shared from '../shared/config';

const ENV = process.env;

var REQUIRED = [
  'KEY',
  'NAME'
];

var missing = _.reject(REQUIRED, _.partial(_.has, ENV));
if (_.any(missing)) throw new Error('Missing env vars: ' + missing.join(', '));

export default {
  ...shared,
  key: ENV.KEY,
  name: ENV.NAME,
  log: {name: 'host'},
  signal: {
    url: ENV.SIGNAL_URL
  }
};
