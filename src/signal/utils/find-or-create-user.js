import createUser from './create-user';
import findUser from './find-user';

export default where =>
  findUser(where).then(user => user || createUser(where));
