import * as app from 'host';
import Peer from 'shared/peer';

const peers = {};

const getPeer = id =>
  peers[id] ||
  (peers[id] = new Peer())
    .on('signal', data => app.live.client.send('signal', {id, data}))
    .on('close', () => { delete peers[id]; });

app.live.client.on('signal', ({id, data}) => getPeer(id).signal(data));

// const messagePeers = message => {
//   _.each(PEERS, peer => peer.send('u', message));
// };

export default {peers};
