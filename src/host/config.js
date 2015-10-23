import _ from 'underscore';
import shared from 'shared/config';

const ENV = process.env;

var REQUIRED = [
  'KEY',
  'PORT',
  'SIGNAL_URL'
];

var missing = _.reject(REQUIRED, _.partial(_.has, ENV));
if (_.any(missing)) throw new Error('Missing env vars: ' + missing.join(', '));

export default {
  ...shared,
  key: ENV.KEY,
  log: {name: 'host'},
  port: ENV.PORT,
  signal: {
    url: ENV.SIGNAL_URL
  }
};
