import async from 'async';
import db from 'signal/utils/db';

export default (where, cb) => {
  async.waterfall([
    cb =>
      db('users')
        .select('*')
        .where(where)
        .asCallback(cb),
    ([user], cb) => cb(null, user)
  ], cb);
};
