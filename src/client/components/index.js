import _ from 'underscore';
import ArenaLight from 'client/lights/arena';
import CarMesh from 'client/meshes/car';
import FloorMesh from 'client/meshes/floor';
import Live from 'live';
import Peer from 'shared/peer';
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import THREE from 'three';
import WorldLight from 'client/lights/world';

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

const KEYS = window.KEYS = {};

document.addEventListener('keydown',
  ({key, which}) => KEYS[key || which] = true
);
document.addEventListener('keyup',
  ({key, which}) => KEYS[key || which] = false
);

export default class extends Component {
  constructor(props) {
    super(props);
    this.cars = {};
    this.peers = {};
    (this.live = new Live())
      .on('peers', ({self, rest}) => {
        const current = _.keys(this.peers);
        _.each(_.difference(current, rest), id => {
          this.getPeer(id).close();
          delete this.peers[id];
          this.scene.remove(this.getCar(id));
          delete this.cars[id];
        });
        _.each(_.difference(rest, current), id => {
          if (self > id) this.getPeer(id).call();
        });
      })
      .on('signal', ({id, data}) => this.getPeer(id).signal(data));
  }

  getPeer(id) {
    const {peers} = this;
    let peer = peers[id];
    if (peer) return peer;
    peer = peers[id] = new Peer({id});
    peer.on('signal', data => this.live.send('signal', {id, data}));
    peer.on('u', _.bind(this.handleUpdate, this, id));
    return peer;
  }

  getCar(id) {
    if (this.cars[id]) return this.cars[id];
    this.scene.add(this.cars[id] = CarMesh());
  }

  handleUpdate(id, [px, pz, ry]) {
    const car = this.getCar(id);
    car.position.x = px;
    car.position.z = pz;
    car.rotation.y = ry;
  }

  componentDidMount() {
    const el = ReactDOM.findDOMNode(this);
    this.scene = new THREE.Scene();

    RENDERER.domElement.style.display = 'block';
    el.appendChild(RENDERER.domElement);

    this.scene.add(WorldLight());
    this.scene.add(ArenaLight());
    this.scene.add(FloorMesh());
    this.ball = new THREE.Vector3(0, 0, 0);
    this.car = CarMesh();
    this.car.gas = 0;
    this.car.wheel = 0;
    this.car.speed = 0;
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
    if (KEYS[40]) this.car.gas = 1;
    else if (KEYS[38]) this.car.gas = -1;
    else if (pad) {
      const {6: reverse, 7: forward} = pad.buttons;
      this.car.gas = forward.value - reverse.value;
    } else this.car.gas = 0;

    if (KEYS[37]) this.car.wheel = -1;
    else if (KEYS[39]) this.car.wheel = 1;
    else if (pad) {
      const [wheel] = pad.axes;
      this.car.wheel = Math.abs(wheel < 0.2) ? 0 : wheel;
    } else this.car.wheel = 0;

    this.car.speed = (this.car.speed + (this.car.gas * 0.1)) * 0.9;
    const {speed, wheel} = this.car;
    this.car.rotation.y += speed * wheel * Math.PI * 0.02;
    this.car.position.x += speed * Math.sin(this.car.rotation.y);
    this.car.position.z += speed * Math.cos(this.car.rotation.y);

    _.each(this.peers, peer =>
      peer.send('u', [
        this.car.position.x,
        this.car.position.z,
        this.car.rotation.y
      ])
    );

    this.updateCamera();
    RENDERER.render(this.scene, CAMERA);
  }

  updateCamera() {
    const {position} = this.car;
    const back = this.ball.clone().setY(0).sub(position.clone().setY(0)).setLength(10);
    CAMERA.position.x = position.x - back.x;
    CAMERA.position.y = position.y + 3;
    CAMERA.position.z = position.z - back.z;
    CAMERA.lookAt(this.ball);
  }

  render() {
    return <div />;
  }
}
