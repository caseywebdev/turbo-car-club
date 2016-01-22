import _ from 'underscore';
import db from './db';

export default id =>
  db('users')
    .where({id})
    .update({signedInAt: new Date()})
    .returning('*')
    .then(_.first);
