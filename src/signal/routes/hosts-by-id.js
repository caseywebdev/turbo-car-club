import _ from 'underscore';
import app from '..';

export default {
  'hostsById.$keys':
  ({1: ids}) => ({
    hostsById: _.reduce(ids, (obj, id) => {
      const hostSocket = app.live.hosts[id];
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
