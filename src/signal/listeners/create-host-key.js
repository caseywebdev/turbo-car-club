import _str from 'underscore.string';
import config from '../config';
import sign from '../../shared/utils/sign';

const {key, errors: {authRequired}} = config;

const NAME_REQUIRED = new Error('Name is required');

export default ({socket: {userId}, params: {name} = {}}) => {
  if (!userId) throw authRequired;
  if (!(name = _str.clean(name))) throw NAME_REQUIRED;
  return sign(key, 'key', {ownerId: userId, name});
};
