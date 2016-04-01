import db from '../utils/db';
import _ from 'underscore';

const PRIVATE_FIELDS = ['emailAddress'];

export default {
  'usersById.$keys':
  ({1: ids, context: {socket: {userId}}}) =>
    db('users').select('*').whereIn('id', ids).then(users => ({
      usersById: _.reduce(users, (obj, user) => {
        obj[user.id] = {
          $merge: _.omit(user, user.id === userId ? [] : PRIVATE_FIELDS)
        };
        return obj;
      }, {})
    }))
};
