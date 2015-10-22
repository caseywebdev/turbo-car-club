import _ from 'underscore';

const ENV = process.env;

var REQUIRED = [
  'KEY',
  'PORT',
  'SIGNAL_URL'
];

var missing = _.reject(REQUIRED, _.partial(_.has, ENV));
if (_.any(missing)) throw new Error('Missing env vars: ' + missing.join(', '));

export default {
  key: ENV.KEY,
  log: {name: 'host'},
  port: ENV.PORT,
  signal: {
    url: ENV.SIGNAL_URL
  }
};
