import _str from 'underscore.string';
import config from '../../shared/config';
import db from '../utils/db';

const {errors: {authRequired}} = config;

const MAX = config.maxUserNameLength;
const INVALID_NAME = new Error(`Name must be between 1 and ${MAX} characters`);

export default {
  user:
  ({context: {socket: {userId}}}) =>
    ({user: {$set: userId ? {$ref: ['usersById', userId]} : null}}),

  'updateUser!.$obj':
  ({1: {name}, context: {socket: {userId}}}) => {
    if (!userId) throw authRequired;

    name = _str.clean(name);
    if (!name || name.length > MAX) throw INVALID_NAME;

    return db('users').where({id: userId}).update({name}).then(() => ({
      usersById: {[userId]: {name: {$set: name}}}
    }));
  }
};
