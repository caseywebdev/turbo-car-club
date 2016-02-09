import app from '..';
import _ from 'underscore';

export default {
  'hostsById.$key.id|name|owner':
  ({1: ids, 2: keys}) =>
    _.map(ids, id => {
      const hostSocket = app.live.sockets[id];
      const host = hostSocket && hostSocket.host;
      if (!host) return {path: ['hostsById', id], value: host};
      return _.map(keys, key => ({
        path: ['hostsById', id, key],
        value: key === 'owner' ? {$ref: ['usersById', host.ownerId]} : host[key]
      }));
    })
};
