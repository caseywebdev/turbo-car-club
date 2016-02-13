import config from '../config';
import findUser from '../utils/find-user';
import sign from '../../shared/utils/sign';
import signIn from '../templates/sign-in';
import mail from '../utils/mail';

const {key} = config;

export default {
  'sign-in!.$params':
  ({context: {socket}, 1: [{emailAddress}]}) =>
    findUser({emailAddress}).then(({signedInAt} = {}) =>
      mail({
        to: emailAddress,
        subject: 'Sign in to Turbo Car Club',
        markdown: signIn({
          token: sign(key, 'verify', {
            emailAddress,
            signedInAt,
            socketId: socket.id
          })
        })
      })
    )
};
