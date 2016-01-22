import _str from 'underscore.string';
import config from '../config';
import db from '../utils/db';
import log from '../utils/log';

const {errors: {authRequired, unknown}} = config;

const MAX = config.maxUserNameLength;
const INVALID_NAME = new Error(`Name must be between 1 and ${MAX} characters`);

export default ({socket: {userId}, params: name}) => {
  if (!userId) throw authRequired;
  name = _str.clean(name);
  if (!name || name.length > MAX) throw INVALID_NAME;
  return db('users')
    .where({id: userId})
    .update({name})
    .catch(er => {
      log.error(er);
      throw unknown;
    });
};
