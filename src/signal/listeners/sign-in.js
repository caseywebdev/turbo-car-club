import config from 'signal/config';
import sign from 'shared/utils/sign';
import signIn from 'signal/templates/sign-in';
import mail from 'signal/utils/mail';

const AUTH_REQUIRED = new Error('Authentication required');

export default (socket, emailAddress, cb) => {
  if (!socket.user) return cb(AUTH_REQUIRED);
  mail({
    to: emailAddress,
    subject: 'Sign in to Turbo Car Club',
    body: signIn({
      token: sign(config.key, {
        type: 'verify',
        emailAddress,
        userId: socket.user.id,
        expiresAt: Date.now() + config.signInTokenDuration
      })
    })
  }, cb);
};
