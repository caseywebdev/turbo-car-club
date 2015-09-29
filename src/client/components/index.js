import _ from 'underscore';
import ArenaLight from 'client/lights/arena';
import CarMesh from 'client/meshes/car';
import Live from 'live';
import Peer from 'shared/peer';
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import THREE from 'three';
import WorldLight from 'client/lights/world';

const MAP_SIZE = 128;

const RENDERER = new THREE.WebGLRenderer();
RENDERER.setSize(window.innerWidth, window.innerHeight);
RENDERER.shadowMap.enabled = true;
RENDERER.shadowMap.cullFace = THREE.CullFaceBack;
RENDERER.shadowMap.type = THREE.PCFSoftShadowMap;

const CAMERA = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
CAMERA.aspect = window.innerWidth / window.innerHeight;
CAMERA.updateProjectionMatrix();

window.addEventListener('resize', () => {
  RENDERER.setSize(window.innerWidth, window.innerHeight);
  CAMERA.aspect = window.innerWidth / window.innerHeight;
  CAMERA.updateProjectionMatrix();
});

export default class extends Component {
  state = {
    cars: {}
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
          this.setState({cars: _.omit(this.state.cars, id)});
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
    const {cars} = this.state;
    cars[id] = {x, y};
    this.setState({cars});
  }

  componentDidMount() {
    const el = ReactDOM.findDOMNode(this);
    this.scene = new THREE.Scene();

    RENDERER.domElement.style.display = 'block';
    el.appendChild(RENDERER.domElement);

    this.scene.add(WorldLight());
    this.scene.add(ArenaLight());

    var plane = new THREE.PlaneBufferGeometry(MAP_SIZE, MAP_SIZE);
    var material = new THREE.MeshLambertMaterial({color: 0x333333});
    var floor = new THREE.Mesh(plane, material);
    floor.receiveShadow = true;
    floor.rotation.x = -Math.PI / 2;
    this.scene.add(floor);
    this.car = CarMesh();
    this.car.az = 0;
    this.car.vz = 0;
    this.scene.add(this.car);
    this.renderMap();
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.rafId);
    RENDERER.domElement.remove();
  }

  renderMap() {
    this.rafId = requestAnimationFrame(::this.renderMap);
    const pad = navigator.getGamepads()[0];
    if (pad && pad.timestamp !== this.lastCheck) {
      const {6: reverse, 7: forward} = pad.buttons;
      this.car.az = -(forward.value - reverse.value) * 0.1;
      this.lastCheck = pad.timestamp;
    }
    this.car.vz = (this.car.vz + this.car.az) * 0.9;
    this.car.position.z += this.car.vz;
    this.updateCamera();
    RENDERER.render(this.scene, CAMERA);
  }

  updateCamera() {
    CAMERA.position.x = this.car.position.x + 2;
    CAMERA.position.y = this.car.position.y + 10;
    CAMERA.position.z = 10;
    CAMERA.lookAt(this.car.position);
  }

  render() {
    return <div />;
  }
}
