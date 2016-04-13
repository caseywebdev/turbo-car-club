import _ from 'underscore';
import app from '..';
import config from '../../shared/config';
import db from '../utils/db';

const {errors: {authRequired}} = config;

export default {
  'expireTokens!':
  ({context: {socket: {userId: id}}}) => {
    if (!id) throw authRequired;

    return db('users')
      .where({id: id})
      .update({expiredTokensAt: new Date()})
      .then(() => {
        _.each([].concat(
          app.live.users[id],
          _.filter(app.live.hosts, ({host: {userId}}) => userId === id)
        ), socket => {
          socket.send('pave', {authToken: {$set: null}, user: {$set: null}});
          socket.close();
        });
      });
  }
};
