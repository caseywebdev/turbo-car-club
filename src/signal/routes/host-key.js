import _str from 'underscore.string';
import config from '../config';
import sign from '../../shared/utils/sign';

const {key, errors: {authRequired}} = config;

const NAME_REQUIRED = new Error('Name is required');

export default {
  'host-key.$obj':
  ({1: params, context: {socket: {userId}}}) => {
    if (!userId) throw authRequired;
    let {name} = params;
    if (!(name = _str.clean(name))) throw NAME_REQUIRED;
    return {
      path: ['host-key', params],
      value: sign(key, 'auth', {type: 'host', ownerId: userId, name})
    };
  }
};
