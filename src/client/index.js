// = require node_modules/amdainty/amdainty.js
// = requireself
// = require ./init.js

import _ from 'underscore';
import Live from 'live';
import Peer from 'shared/peer';

const live = new Live();

const peers = window.peers = {};

document.addEventListener('mousemove', ({pageX: x, pageY: y}) =>
  _.each(peers, peer => peer.send('mouse', [x, y]))
);

const getPeer = id => {
  let peer = peers[id];
  if (peer) return peer;
  peer = peers[id] = new Peer({id});
  peer.on('signal', data => live.send('signal', {id, data}));
  peer.on('mouse', ::console.log);
  return peer;
};

live
  .on('peers', ({self, rest}) => {
    const current = _.keys(peers);
    _.each(_.difference(current, rest), id => delete peers[id]);
    _.each(_.difference(rest, current), id => self > id && getPeer(id).call());
  })
  .on('signal', ({id, data}) => getPeer(id).signal(data));
