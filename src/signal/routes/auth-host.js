import app from '..';
import config from '../config';
import log from '../utils/log';
import verify from '../../shared/utils/verify';

const {key, errors: {invalidKey}} = config;

export default {
  'auth-host!.$params':
  ({context: {socket}, 1: [{token}]}) => {
    const data = verify(key, 'host', token);
    if (!data) throw invalidKey;

    const {ownerId, name} = data;
    const id = `${ownerId}-${name}`;
    if (app.live.sockets[id]) throw new Error(`Host ${id} is already online`);

    socket.host = {id, key: token, ...data};
    log.info(`${socket.id} signed in as host ${id}`);
    delete app.live.sockets[socket.id];
    app.live.sockets[socket.id = id] = socket;
  }
};
