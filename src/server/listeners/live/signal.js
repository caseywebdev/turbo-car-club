import * as app from 'server';

export default (socket, {id, data}, cb) => {
  const recipient = app.live.sockets[id];
  if (recipient) recipient.send('signal', {id: socket.id, data});
};
