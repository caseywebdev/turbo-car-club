import _ from 'underscore';
import async from 'async';
import config from 'signal/config';
import findUser from 'signal/utils/find-user';
import sign from 'shared/utils/sign';
import signIn from 'signal/templates/sign-in';
import mail from 'signal/utils/mail';

const {key, errors: {unknown}} = config;

export default (socket, emailAddress, cb) => {
  async.waterfall([
    _.partial(findUser, {email_address: emailAddress}),
    (user, cb) =>
      mail({
        to: emailAddress,
        subject: 'Sign in to Turbo Car Club',
        markdown: signIn({
          key: sign(key, 'verify', {
            emailAddress,
            socketId: socket.id,
            signedInAt: user ? user.signed_in_at : null
          })
        })
      }, cb)
  ], er => cb(er && unknown));
};
