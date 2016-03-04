import db from './db';
import config from '../config';
import verify from '../../shared/utils/verify';
import authHost from './auth-host';
import authUser from './auth-user';

const {key, errors: {invalidKey}, authKeyMaxAge} = config;

export default (socket, token, {host: {name} = {}} = {}) => {
  if (socket.userId || socket.host) return;

  const data = verify(key, 'auth', token, authKeyMaxAge);
  if (!data) throw invalidKey;

  const {userId} = data;
  return db('users').select('*').where({id: userId}).then(([user]) => {
    if (!user) throw invalidKey;

    const {invalidatedTokensAt} = user;
    if (invalidatedTokensAt && data.iat * 1000 < invalidatedTokensAt) {
      throw invalidKey;
    }

    if (name) return authHost(socket, userId, name, token);

    return authUser(socket, userId);
  });

};
