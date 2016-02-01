import app from '../..';
import _ from 'underscore';
import {ref as $ref} from 'falcor-json-graph';

export default {
  route: 'hostsById[{keys}]["id","name","owner"]',
  get: (__, {1: ids, 2: keys}) =>
    _.flatten(_.map(ids, id => {
      const hostSocket = app.live.sockets[id];
      const host = hostSocket && hostSocket.host;
      if (!host) return {path: ['hostsById', id], value: host};
      return _.map(keys, key => ({
        path: ['hostsById', id, key],
        value: key === 'owner' ? $ref(['usersById', host.ownerId]) : host[key]
      }));
    }))
};
