import app from '..';
import log from '../utils/log';

export default ({socket, params: {id, data}}) => {
  log.info(`${socket.id} signaled ${id}: ${data.type}`);
  const recipient = app.live.sockets[id];
  if (!recipient) {
    const er = new Error(`Recipient ${id} not found!`);
    log.error(er.message);
    throw er;
  }
  recipient.send('signal', {id: socket.id, data});
};
