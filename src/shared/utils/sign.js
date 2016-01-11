import config from '../config';
import getHmac from './get-hmac';

const {encoding} = config.crypto;

export default (key, type, obj) => {
  const data = new Buffer(JSON.stringify([[type, Date.now()], obj]));
  return Buffer.concat([getHmac(key, data), data]).toString(encoding);
};
