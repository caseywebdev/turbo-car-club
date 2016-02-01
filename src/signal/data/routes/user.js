import config from '../../../shared/config';
import {ref as $ref} from 'falcor-json-graph';

const {errors: {authRequired}} = config;

export default {
  route: 'user',
  get: ({userId}) => {
    if (!userId) throw authRequired;
    return {path: ['user'], value: $ref(['usersById', userId])};
  }
};
