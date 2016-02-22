import _ from 'underscore';
import app from '..';

export default {
  'hosts.$keys':
  ({1: keys}) => {
    const hosts = _.values(app.live.hosts);
    return _.map(keys, key => ({
      path: ['hosts', key],
      value:
        key === 'length' ? _.size(hosts) :
        hosts[key] ? {$ref: ['hostsById', hosts[key].host.id]} :
        null
    }));
  }
};
