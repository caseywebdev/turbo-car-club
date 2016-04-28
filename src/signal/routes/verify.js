import app from '..';
import auth from '../utils/auth';
import config from '../config';
import findOrCreateUser from '../utils/find-or-create-user';
import sign from '../../shared/utils/sign';
import updateSignedInAt from '../utils/update-signed-in-at';
import verify from '../../shared/utils/verify';

const {key, errors: {invalidKey}, verifyKeyMaxAge} = config;

const checkSignedInAt = (data, {id, signedInAt, expiredTokensAt}) => {
  if (signedInAt) signedInAt = signedInAt.toISOString();
  if (signedInAt !== data.signedInAt) throw invalidKey;

  if (expiredTokensAt && data.iat * 1000 < expiredTokensAt) throw invalidKey;

  return updateSignedInAt(id);
};

const createAuthToken = (socket, data, user) => {
  const {id: userId} = user;
  const token = sign(key, 'auth', {userId});
  const origin = app.live.sockets[data.socketId];
  const delta = {authToken: {$set: token}, user: {$set: user}};
  if (origin && origin !== socket) {
    auth(origin, token);
    origin.send('pave', delta);
  }
  return auth(socket, token).then(() => delta);
};

export default {
  'verify!.$obj':
  ({store: {cache: {socket}}, 1: {token}}) => {
    const data = verify(key, 'verify', token, verifyKeyMaxAge);
    if (!data) throw invalidKey;

    const {emailAddress} = data;
    return findOrCreateUser({emailAddress})
      .then(user => checkSignedInAt(data, user))
      .then(user => createAuthToken(socket, data, user));
  }
};
