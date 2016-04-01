import _ from 'underscore';
import app from '..';

export default {
  'hosts.$keys':
  ({1: keys}) => {
    const hosts = _.map(app.live.hosts, 'host');
    return {
      hosts: {
        $set: _.reduce(keys, (obj, key) => {
          obj[key] = hosts[key] ? {$ref: ['hostsById', hosts[key].id]} : null;
          return obj;
        }, {length: hosts.length})
      }
    };
  }
};
