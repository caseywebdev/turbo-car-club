import _ from 'underscore';
import app from '..';
import db from '../utils/db';

export default cb => {
  const hosts = _.compact(_.map(app.live.sockets, 'host'));
  const userIds = _.unique(_.map(hosts, 'userId'));
  db('users')
    .select('id', 'name')
    .whereIn('id', userIds)
    .asCallback((er, users) => {
      if (er) return cb(er);
      users = _.indexBy(users, 'id');
      cb(null, _.map(hosts, ({userId, region, name}) =>
        ({user: users[userId], region, name})
      ));
    });
};
