import app from '..';
import db from '../utils/db';
import _ from 'underscore';
import {ref as $ref} from 'falcor-json-graph';
import Router from 'falcor-router';

const purify = fn => function (...args) { return fn(this.context, ...args); };

const routes = _.map([{
  route: 'hosts[{keys}]',
  get: (__, {1: keys}) => {
    const hosts = _.compact(_.map(app.live.sockets, 'host'));
    return _.map(keys, key => ({
      path: ['hosts', key],
      value:
        key === 'length' ? hosts.length :
        hosts[key] ? $ref(['hostsById', hosts[key].id]) :
        null
    }));
  }
}, {
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
}, {
  route: 'usersById[{integers}]["id","name"]',
  get: (__, {1: ids, 2: keys}) =>
    db('users').select('id', 'name').whereIn('id', ids).then(users =>
      _.flatten(users, user =>
        _.map(keys, key => ({
          path: ['usersById', user.id, key],
          value: user[key]
        }))
      )
    )
}], ({route, ...rest}) => ({route, ..._.mapObject(rest, purify)}));

export default class extends Router.createClass(routes) {
  constructor(context) {
    super();
    this.context = context;
  }
}
