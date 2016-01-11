import _str from 'underscore.string';
import config from '../config';
import db from '../utils/db';
import log from '../utils/log';

const {errors: {authRequired, unknown}} = config;

const MAX = config.maxUserNameLength;
const INVALID_NAME = new Error(`Name must be between 1 and ${MAX} characters`);

export default ({userId}, name, cb) => {
  if (!userId) return cb(authRequired);
  name = _str.clean(name);
  if (!name || name.length > MAX) return cb(INVALID_NAME);
  db('users')
    .where({id: userId})
    .update({name})
    .asCallback(er => {
      if (er) {
        log.error(er);
        return cb(unknown);
      }
      cb();
    });
};
