import _ from 'underscore';
import Live from 'live';
import Peer from 'shared/peer';
import React, {Component} from 'react';

export default class extends Component {
  state = {
    mice: {}
  }

  constructor(props) {
    super(props);
    this.peers = {};
    (this.live = new Live())
      .on('peers', ({self, rest}) => {
        const current = _.keys(this.peers);
        _.each(_.difference(current, rest), id => {
          this.getPeer(id).close();
          delete this.peers[id];
          this.setState({mice: _.omit(this.state.mice, id)});
        });
        _.each(_.difference(rest, current), id => {
          if (self > id) this.getPeer(id).call();
        });
      })
      .on('signal', ({id, data}) => this.getPeer(id).signal(data));
    document.addEventListener('mousemove', ({pageX: x, pageY: y}) =>
      _.each(this.peers, peer => peer.send('mouse', [x, y]))
    );
  }

  getPeer(id) {
    const {peers} = this;
    let peer = peers[id];
    if (peer) return peer;
    peer = peers[id] = new Peer({id});
    peer.on('signal', data => this.live.send('signal', {id, data}));
    peer.on('mouse', _.bind(this.handleMouse, this, id));
    return peer;
  }

  handleMouse(id, [x, y]) {
    const {mice} = this.state;
    mice[id] = {x, y};
    this.setState({mice});
  }

  renderMouse({x, y}, id) {
    return (
      <div
        key={id}
        style={{
          background: '#000',
          borderRadius: '50%',
          height: 10,
          left: x,
          position: 'fixed',
          top: y,
          width: 10
        }}
      />
    );
  }

  render() {
    return <div>{_.map(this.state.mice, ::this.renderMouse)}</div>;
  }
}
