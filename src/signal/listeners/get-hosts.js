import _ from 'underscore';
import app from '..';
import db from '../utils/db';

export default (socket, __, cb) => {
  const hosts = _.compact(_.map(app.live.sockets, 'host'));
  const userIds = _.unique(_.map(hosts, 'userId'));
  db('users')
    .select('*')
    .whereIn('id', userIds)
    .asCallback((er, users) => {
      if (er) return cb(er);
      users = _.indexBy(users, 'id');
      cb(null, _.map(hosts, ({userId, region, name}) =>
        ({user: _.pick(users[userId], 'id', 'name'), region, name})
      ));
    });
};
