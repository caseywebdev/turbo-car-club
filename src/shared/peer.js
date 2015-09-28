import _ from 'underscore';

const resolveKey = key =>
  typeof window === 'undefined' ? require('wrtc')[key] : (
    window[key] ||
    window[`moz${key}`] ||
    window[`ms${key}`] ||
    window[`webkit${key}`]
  );

const RTCPeerConnection = resolveKey('RTCPeerConnection');
const RTCSessionDescription = resolveKey('RTCSessionDescription');
const RTCIceCandidate = resolveKey('RTCIceCandidate');

const PC_CONFIG = {iceServers: [{urls: 'stun:stun.l.google.com:19302'}]};
const DC_CONFIG = {ordered: false, maxRetransmits: 0};

export default class {
  constructor({id}) {
    this.id = id;
    this.listeners = {};
    this.candidates = [];
    this.conn = new RTCPeerConnection(PC_CONFIG);
    this.conn.onicecandidate = ({candidate}) =>
      candidate && this.sendCandidate(candidate);
  }

  call() {
    this.setDataChannel(this.conn.createDataChannel('data', DC_CONFIG));
    this.conn.createOffer(data =>
      this.conn.setLocalDescription(data, () =>
        this.trigger('signal', {type: 'offer', data})
      , ::this.handleError)
    , ::this.handleError);
  }

  signal({type, data}) {
    switch (type) {
    case 'offer': return this.handleOffer(new RTCSessionDescription(data));
    case 'answer': return this.handleAnswer(new RTCSessionDescription(data));
    case 'call-answered': return this.flushCandidates();
    case 'candidates':
      return _.each(data, candidate =>
        this.addCandidate(new RTCIceCandidate(candidate))
      );
    }
  }

  handleOffer(offer) {
    this.conn.ondatachannel = ({channel}) => this.setDataChannel(channel);
    this.conn.setRemoteDescription(offer, () =>
      this.conn.createAnswer(data =>
        this.conn.setLocalDescription(data, () =>
          this.trigger('signal', {type: 'answer', data})
        , ::this.handleError)
      , ::this.handleError)
    , ::this.handleError);
  }

  handleAnswer(answer) {
    this.conn.setRemoteDescription(answer, () => {
      this.trigger('signal', {type: 'call-answered'});
      this.flushCandidates();
    }, :: this.handleError);
  }

  handleError(er) {
    console.error(er);
  }

  setDataChannel(channel) {
    this.channel = channel;
    channel.onmessage = ::this.handleMessage;
  }

  handleMessage({data}) {
    const parsed = JSON.parse(data);
    this.trigger(parsed.n, parsed.d);
  }

  addCandidate(candidate) {
    this.conn.addIceCandidate(candidate);
  }

  flushCandidates() {
    this.sendCandidates(this.candidates);
    delete this.candidates;
  }

  sendCandidates(data) {
    this.trigger('signal', {type: 'candidates', data});
  }

  sendCandidate(candidate) {
    if (this.candidates) return this.candidates.push(candidate);
    this.sendCandidates([candidate]);
  }

  send(n, d) {
    if (!this.channel || this.channel.readyState !== 'open') return this;
    this.channel.send(JSON.stringify({n, d}));
    return this;
  }

  on(name, cb) {
    let listeners = this.listeners[name];
    if (!listeners) listeners = this.listeners[name] = [];
    listeners.push(cb);
    return this;
  }

  off(name, cb) {
    if (!name) {
      this.listeners = {};
      return this;
    }
    let listeners = this.listeners[name];
    if (!listeners) return this;
    if (cb) {
      this.listeners[name] = _.without(listeners, cb);
      if (!listeners.length) delete this.listeners[name];
    }
    else delete this.listeners[name];
    return this;
  }

  trigger(name, data) {
    const listeners = this.listeners[name];
    if (!listeners) return this;
    for (let i = 0, l = listeners.length; i < l; ++i) listeners[i](data);
    return this;
  }
}
