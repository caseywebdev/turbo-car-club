import app from '..';
import config from '../config';
import findOrCreateUser from '../utils/find-or-create-user';
import sign from '../../shared/utils/sign';
import updateSignedInAt from '../utils/update-signed-in-at';
import verify from '../../shared/utils/verify';

const {key, errors: {invalidKey}, verifyKeyMaxAge} = config;

export default {
  'verify!.$obj':
  ({context: {socket}, 1: {token}}) => {
    const data = verify(key, 'verify', token, verifyKeyMaxAge);
    if (!data) throw invalidKey;
    const {emailAddress} = data;
    return findOrCreateUser({emailAddress})
      .then(({id, signedInAt}) => {
        if (signedInAt) signedInAt = signedInAt.toISOString();
        if (signedInAt !== data.signedInAt) throw invalidKey;
        return updateSignedInAt(id);
      })
      .then(user => {
        const authToken = sign(key, 'auth', {type: 'user', userId: user.id});
        const origin = app.live.sockets[data.socketId];
        if (origin && origin !== socket) origin.send('auth', authToken);
        return {path: ['authToken'], value: authToken};
      });
  }
};
