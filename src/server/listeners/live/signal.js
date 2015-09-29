import * as app from 'server';
import log from 'server/utils/log';

export default (socket, {id, data}, cb) => {
  const recipient = app.live.sockets[id];
  log.info(`Signal: ${data.type} from ${id} for ${socket.id}`);
  if (recipient) recipient.send('signal', {id: socket.id, data});
  else log.error(`Recipient ${socket.id} not found!`);
};
