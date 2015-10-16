import log from 'signal/utils/log';

export default socket => {
  log.info(`${socket.id} is now a host`);
  socket.isHost = true;
};
