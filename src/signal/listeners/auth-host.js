import _ from 'underscore';
import app from '..';
import config from '../config';
import log from '../utils/log';
import verify from '../../shared/utils/verify';

const {key, errors: {invalidKey}} = config;

export default ({socket, params: token}) => {
  const data = verify(key, 'host', token);
  if (!data) throw invalidKey;

  const {userId, region, name} = data;
  const unique = `${userId}/${region}/${name}`;
  if (_.any(_.map(app.live.sockets, 'host'), {userId, region, name})) {
    throw new Error(`Host ${unique} is already online`);
  }

  socket.host = {id: socket.id, key: token, ...data};
  log.info(`${socket.id} signed in as host ${unique} at ${data.url}`);
  return true;
};
