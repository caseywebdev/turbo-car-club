import _ from 'underscore';
import {trigger} from '../utils/subs';
import app from '..';
import config from '../config';
import log from '../utils/log';
import verify from '../../shared/utils/verify';

const {key, errors: {invalidKey}, authKeyMaxAge} = config;

const authUser = (socket, userId) => {
  log.info(`${socket.id} authorized as User ${userId}`);
  const {users} = app.live;
  const prevId = socket.userId;
  if (prevId && users[prevId]) {
    users[prevId] = _.without(users[prevId], socket);
    if (!users[prevId].length) delete users[prevId];
  }
  socket.userId = userId;
  if (!users[userId]) users[userId] = [];
  users[userId].push(socket);
};

const authHost = (socket, ownerId, name, key) => {
  const id = `${ownerId}-${name}`;
  if (app.live.hosts[id]) throw new Error(`Host ${id} is already online`);

  socket.host = {id, key, ownerId, name};
  log.info(`${socket.id} signed in as host ${id}`);
  app.live.hosts[id] = socket;
  trigger('host-added');
};

export default {
  'auth!.$obj':
  ({context: {socket}, 1: {token, host: {name} = {}}}) => {
    if (socket.userId || socket.host) return;
    const data = verify(key, 'auth', token, authKeyMaxAge);
    if (!data) throw invalidKey;
    const {userId} = data;
    if (name) return authHost(socket, userId, name, token);
    return authUser(socket, userId);
  }
};
