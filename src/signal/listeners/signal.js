import app from '..';
import log from '../utils/log';

export default (socket, {id, data}, cb) => {
  log.info(`${socket.id} signaled ${id}: ${data.type}`);
  const recipient = app.live.sockets[id];
  if (recipient) return recipient.send('signal', {id: socket.id, data});
  const er = new Error(`Recipient ${id} not found!`);
  log.error(er.message);
  cb(er);
};
