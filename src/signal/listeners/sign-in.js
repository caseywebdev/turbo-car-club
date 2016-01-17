import _ from 'underscore';
import async from 'async';
import config from '../config';
import findUser from '../utils/find-user';
import sign from '../../shared/utils/sign';
import signIn from '../templates/sign-in';
import mail from '../utils/mail';

const {key} = config;

export default (socket, emailAddress, cb) =>
  async.waterfall([
    _.partial(findUser, {emailAddress}),
    ({signedInAt} = {}, cb) =>
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
      }, cb)
  ], cb);
