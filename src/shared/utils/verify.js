import config from 'shared/config';
import getHmac from 'shared/utils/get-hmac';

const {encoding, hashSize} = config.crypto;

export default (key, str) => {
  try {
    const buffer = new Buffer(str, encoding);
    const hmac = buffer.slice(0, hashSize);
    const data = buffer.slice(hashSize);
    if (hmac.compare(getHmac(key, data)) === 0) {
      return JSON.parse(data.toString());
    }
  } catch (er) {}
  return null;
};
