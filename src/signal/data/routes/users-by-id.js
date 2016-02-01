import db from '../../utils/db';
import _ from 'underscore';

export default {
  route: 'usersById[{integers}]["id","name","emailAddress"]',
  get: ({userId}, {1: ids, 2: keys}) =>
    db('users').select('*').whereIn('id', ids).then(users =>
      _.flatten(
        _.map(users, user =>
          _.map(keys, key => console.log(key) || ({
            path: ['usersById', user.id, key],
            value:
              user.id === userId || key !== 'emailAddress' ?
              user[key] :
              null
          }))
        )
      )
    )
};
