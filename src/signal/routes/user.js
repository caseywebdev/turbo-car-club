import config from '../../shared/config';

const {errors: {authRequired}} = config;

export default {
  user:
  ({context: {socket: {userId}}}) => {
    if (!userId) throw authRequired;
    return {path: ['user'], value: {$ref: ['usersById', userId]}};
  }
};
