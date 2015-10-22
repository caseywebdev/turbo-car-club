import config from 'shared/config';
import getHmac from 'shared/utils/get-hmac';

const {encoding} = config.crypto;

export default (key, obj) => {
  const data = new Buffer(JSON.stringify(obj));
  return Buffer.concat([getHmac(key, data), data]).toString(encoding);
};
