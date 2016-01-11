import _str from 'underscore.string';
import config from '../config';
import sign from '../../shared/utils/sign';

const {key, errors: {authRequired}} = config;

const REGION_REQUIRED = new Error('Region is required');
const NAME_REQUIRED = new Error('Name is required');
const URL_REQUIRED = new Error('URL is required');

export default ({userId}, options, cb) => {
  let {region, name, url} = options || {};
  if (!userId) return cb(authRequired);
  if (!(region = _str.clean(region))) return cb(REGION_REQUIRED);
  if (!(name = _str.clean(name))) return cb(NAME_REQUIRED);
  if (!(url = _str.clean(url))) return cb(URL_REQUIRED);
  cb(null, sign(key, 'key', {userId, region, name, url}));
};
