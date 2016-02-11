import db from '../utils/db';
import _ from 'underscore';

export default {
  'usersById.$key.id|name|emailAddress':
  ({1: ids, 2: keys, context: {userId}}) =>
    db('users').select('*').whereIn('id', ids).then(users =>
      _.map(users, user =>
        _.map(keys, key => ({
          path: ['usersById', user.id, key],
          value:
            user.id === userId || key !== 'emailAddress' ?
            user[key] :
            null
        }))
      )
    )
};