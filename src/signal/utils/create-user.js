import async from 'async';
import db from './db';

export default (where, cb) =>
  async.waterfall([
    cb =>
      db('users')
        .insert(where)
        .returning('*')
        .asCallback(cb),
    ([user], cb) => cb(null, user)
  ], cb);
