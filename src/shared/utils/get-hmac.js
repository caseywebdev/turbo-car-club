import config from '../config';
import crypto from 'crypto';

const {hashAlgo} = config.crypto;

export default (key, buffer) => {
  const hmac = crypto.createHmac(hashAlgo, key);
  hmac.end(buffer);
  return hmac.read();
};
