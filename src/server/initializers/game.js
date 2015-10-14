import _ from 'underscore';
import config from 'server/config';
import Game from 'shared/objects/game';
import Live from 'live-socket';
import Peer from 'shared/peer';
import ws from 'ws';

const PEERS = {};

const getPeer = id => {
  let peer = PEERS[id];
  if (peer) return peer;
  peer = PEERS[id] = new Peer();
  peer.id = id;
  return peer
    .on('signal', data => live.send('signal', {id, data}))
    .on('close', () => { delete PEERS[id]; });
};

const live = new Live({WebSocket: ws, url: `ws://0.0.0.0:${config.port}`});
live.send('host');
live.on('signal', ({id, data}) => getPeer(id).signal(data));

const messagePeers = message => _.each(PEERS, peer => peer.send('u', message));

export default new Game(messagePeers);
