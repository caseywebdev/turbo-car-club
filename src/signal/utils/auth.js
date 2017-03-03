import authHost from './auth-host';
import authUser from './auth-user';
import Promise from 'better-promise';
import config from '../config';
import db from './db';
import verify from '../../shared/utils/verify';

const {key, errors: {invalidKey}} = config;

export default (socket, token, {host: {name} = {}} = {}) => {
  if (socket.userId || socket.host) return Promise.resolve();

  const data = verify(key, 'auth', token);
  if (!data) throw invalidKey;

  const {userId} = data;
  return db('users').select('*').where({id: userId}).then(([user]) => {
    if (!user) throw invalidKey;

    const {expiredTokensAt} = user;
    if (expiredTokensAt && data.iat * 1000 < expiredTokensAt) {
      throw invalidKey;
    }

    if (name) return authHost(socket, userId, name, token);

    return authUser(socket, userId);
  });
};
