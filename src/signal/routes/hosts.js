import app from '..';
import _ from 'underscore';

export default {
  'hosts.$key':
  ({1: keys}) => {
    const hosts = _.compact(_.map(app.live.sockets, 'host'));
    return _.map(keys, key => ({
      path: ['hosts', key],
      value:
        key === 'length' ? hosts.length :
        hosts[key] ? {$ref: ['hostsById', hosts[key].id]} :
        null
    }));
  }
};
