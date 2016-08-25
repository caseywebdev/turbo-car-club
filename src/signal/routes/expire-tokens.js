import _ from 'underscore';
import config from '../../shared/config';
import db from '../utils/db';
import sockets from '../utils/sockets';

const {errors: {authRequired}} = config;

export default {
  'expireTokens!':
  ({store: {cache: {socket: {userId: id}}}}) => {
    if (!id) throw authRequired;

    return db('users')
      .where({id: id})
      .update({expiredTokensAt: new Date()})
      .then(() => {
        _.each([].concat(
          sockets.users[id],
          _.filter(sockets.hosts, ({host: {userId}}) => userId === id)
        ), socket => {
          socket.send('pave', {authToken: {$set: null}, user: {$set: null}});
          socket.close();
        });
      });
  }
};
