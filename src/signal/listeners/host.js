import log from 'signal/utils/log';

export default (socket, {region, name, url}) => {
  log.info(
    `${socket.id} is now a host REGION=${region} NAME=${name} URL=${url}`
  );
  socket.isHost = true;
};
