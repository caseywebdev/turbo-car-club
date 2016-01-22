import _ from 'underscore';
import db from './db';

export default where =>
  db('users').select('*').where(where).then(_.first);
