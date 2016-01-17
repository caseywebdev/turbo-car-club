import _ from 'underscore';
import app from '..';
import config from '../config';
import log from '../utils/log';
import verify from '../../shared/utils/verify';

const {key, errors: {invalidKey}} = config;

export default (socket, token, cb) => {
  const data = verify(key, 'host', token);
  if (!data) return cb(invalidKey);

  const {userId, region, name} = data;
  const id = `${userId}/${region}/${name}`;
  if (_.any(_.map(app.live.sockets, 'host'), {userId, region, name})) {
    return cb(new Error(`Host ${id} is already online`));
  }

  socket.host = {key: token, ...data};
  log.info(`${socket.id} signed in as host ${id} at ${data.url}`);
  cb();
};
