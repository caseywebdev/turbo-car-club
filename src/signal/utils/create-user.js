import _ from 'underscore';
import db from './db';

export default where =>
  db('users').insert(where).returning('*').then(_.first);
