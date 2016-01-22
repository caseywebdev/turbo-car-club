import _str from 'underscore.string';
import config from '../config';
import sign from '../../shared/utils/sign';

const {key, errors: {authRequired}} = config;

const REGION_REQUIRED = new Error('Region is required');
const NAME_REQUIRED = new Error('Name is required');
const URL_REQUIRED = new Error('URL is required');

export default ({socket: {userId}, params: {region, name, url} = {}}) => {
  if (!userId) throw authRequired;
  if (!(region = _str.clean(region))) throw REGION_REQUIRED;
  if (!(name = _str.clean(name))) throw NAME_REQUIRED;
  if (!(url = _str.clean(url))) throw URL_REQUIRED;
  return sign(key, 'key', {userId, region, name, url});
};
