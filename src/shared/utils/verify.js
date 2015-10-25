import config from 'shared/config';
import getHmac from 'shared/utils/get-hmac';

const {encoding, hashSize} = config.crypto;

export default (key, type, str, ttl) => {
  try {
    const buffer = new Buffer(str, encoding);
    const hmac = buffer.slice(0, hashSize);
    let data = buffer.slice(hashSize);
    if (hmac.compare(getHmac(key, data)) !== 0) return null;
    data = JSON.parse(data.toString());
    if (data[0][0] !== type) return null;
    if (ttl && Date.now() > data[0][1] + ttl) return null;
    return data[1];
  } catch (er) {}
  return null;
};
