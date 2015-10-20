import _ from 'underscore';

const ENV = process.env;

var REQUIRED = [
  'NAME',
  'PORT',
  'REGION',
  'SIGNAL_URL',
  'URL'
];

var missing = _.reject(REQUIRED, _.partial(_.has, ENV));
if (_.any(missing)) throw new Error('Missing env vars: ' + missing.join(', '));

export default {
  log: {name: 'host'},
  name: ENV.NAME,
  port: ENV.PORT,
  region: ENV.REGION,
  signal: {
    url: ENV.SIGNAL_URL
  },
  url: ENV.URL
};
