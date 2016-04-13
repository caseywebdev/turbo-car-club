import _ from 'underscore';
import app from '..';
import config from '../../shared/config';
import db from '../utils/db';
import signOut from '../utils/sign-out';

const {errors: {authRequired}} = config;

export default {
  'expireTokens!':
  ({context: {socket: {userId: id}}}) => {
    if (!id) throw authRequired;

    return db('users')
      .where({id: id})
      .update({expiredTokensAt: new Date()})
      .then(() => {
        console.log(app.live.users[id].length);
        _.each([].concat(
          app.live.users[id],
          _.filter(app.live.hosts, ({host: {userId}}) => userId === id)
        ), signOut);
      });
  }
};
