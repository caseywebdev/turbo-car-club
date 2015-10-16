import _ from 'underscore';
import config from 'host/config';
import Game from 'shared/objects/game';
import Live from 'live-socket';
import Peer from 'shared/peer';
import ws from 'ws';

const PEERS = {};

const getPeer = id =>
  PEERS[id] ||
  (PEERS[id] = new Peer())
    .on('signal', data => live.send('signal', {id, data}))
    .on('close', () => { delete PEERS[id]; });

const live = new Live({WebSocket: ws, ...config.signal});
live.send('host', {name: 'TCCHQ', url: 'docker:8080'});
live.on('signal', ({id, data}) => getPeer(id).signal(data));

// const messagePeers = message => {
//   _.each(PEERS, peer => peer.send('u', message));
// };

export default new Game(_.noop);
