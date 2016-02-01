import _ from 'underscore';
import Router from 'falcor-router';

import hostsById from './routes/hosts-by-id';
import hosts from './routes/hosts';
import user from './routes/user';
import usersById from './routes/users-by-id';

const purify = fn => function (...args) { return fn(this.context, ...args); };

const routes = _.map(_.flatten([
  hosts,
  hostsById,
  usersById,
  user
]), ({route, ...rest}) => ({route, ..._.mapObject(rest, purify)}));

export default class extends Router.createClass(routes) {
  constructor(context) {
    super();
    this.context = context;
  }
}
