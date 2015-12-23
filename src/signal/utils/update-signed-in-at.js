import async from 'async';
import db from 'signal/utils/db';

export default (id, cb) =>
  async.waterfall([
    cb =>
      db.table('users')
        .where({id})
        .update({signedInAt: new Date()})
        .returning('*')
        .asCallback(cb),
    ([user], cb) => cb(null, user)
  ], cb);
