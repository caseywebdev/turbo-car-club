import _ from 'underscore';
import sockets from '../utils/sockets';

export default {
  'hostsById.$keys':
  ({1: ids}) => ({
    hostsById: _.reduce(ids, (obj, id) => {
      const hostSocket = sockets.hosts[id];
      const host = hostSocket && hostSocket.host;
      obj[id] =
        host ? {
          $merge: {
            ..._.omit(host, 'ownerId'),
            owner: {$ref: ['usersById', host.ownerId]}
          }
        } : {$set: null};
      return obj;
    }, {})
  })
};
