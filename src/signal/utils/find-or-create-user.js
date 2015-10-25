import async from 'async';
import createUser from 'signal/utils/create-user';
import findUser from 'signal/utils/find-user';

export default (where, cb) =>
  async.waterfall([
    cb => findUser(where, cb),
    (user, cb) => user ? cb(null, user) : createUser(where, cb)
  ], cb);
