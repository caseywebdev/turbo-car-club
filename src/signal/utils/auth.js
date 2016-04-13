import {SyncPromise} from 'pave';
import authHost from './auth-host';
import authUser from './auth-user';
import config from '../config';
import db from './db';
import verify from '../../shared/utils/verify';

const {key, errors: {invalidKey}, authKeyMaxAge} = config;

export default (socket, token, {host: {name} = {}} = {}) => {
  if (socket.userId || socket.host) return SyncPromise.resolve();

  const data = verify(key, 'auth', token, authKeyMaxAge);
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
