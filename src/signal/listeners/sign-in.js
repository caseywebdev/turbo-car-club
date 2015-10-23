import async from 'async';
import config from 'signal/config';
import db from 'signal/utils/db';
import sign from 'shared/utils/sign';
import signIn from 'signal/templates/sign-in';
import mail from 'signal/utils/mail';

const {unknown} = config.errors;

export default (socket, emailAddress, cb) => {
  async.waterfall([
    cb =>
      db.select('signed_in_at')
        .from('users')
        .join('email_addresses', {'email_addresses.user_id': 'users.id'})
        .where({email_address: emailAddress})
        .asCallback(cb),
    ([user], cb) =>
      mail({
        to: emailAddress,
        subject: 'Sign in to Turbo Car Club',
        body: signIn({
          key: sign(config.key, {
            type: 'verify',
            emailAddress,
            socketId: socket.id,
            signedInAt: user && user.signed_in_at,
            expiresAt: Date.now() + config.signInTokenDuration
          })
        })
      }, cb)
  ], er => cb(er && unknown));
};
