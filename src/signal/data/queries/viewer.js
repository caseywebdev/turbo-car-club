import User from '../models/user';
import anonymousUser from '../../utils/anonymous-user';
import findUser from '../../utils/find-user';

export default {
  type: User,
  resolve: ({socket: {userId: id}}) =>
    id ?
    findUser({id}).then(user => user || anonymousUser) :
    anonymousUser
};
