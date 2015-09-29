import _ from 'underscore';
import Live from 'live';
import Peer from 'shared/peer';
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import THREE from 'three';

const MAP_SIZE = 32;

const RENDERER = new THREE.WebGLRenderer();
RENDERER.setSize(window.innerWidth, window.innerHeight);
RENDERER.shadowMap.enabled = true;
RENDERER.shadowMap.cullFace = THREE.CullFaceBack;
RENDERER.shadowMap.type = THREE.PCFSoftShadowMap;

const CAMERA = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
CAMERA.up = new THREE.Vector3(0, 0, 1);

window.addEventListener('resize', () => {
  RENDERER.setSize(window.innerWidth, window.innerHeight);
  CAMERA.aspect = window.innerWidth / window.innerHeight;
  CAMERA.updateProjectionMatrix();
});

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

  componentDidMount() {
    const el = ReactDOM.findDOMNode(this);
    this.scene = new THREE.Scene();

    RENDERER.domElement.style.display = 'block';
    el.appendChild(RENDERER.domElement);

    var light = new THREE.DirectionalLight(0xffffff, 0.9);
    light.position.set(MAP_SIZE / 2, MAP_SIZE / 2, 10);
    light.target.position.set(MAP_SIZE / 2 + 2, MAP_SIZE / 2 - 2, 0);
    light.castShadow = true;
    light.shadowCameraNear = 0;
    light.shadowCameraFar = MAP_SIZE;
    light.shadowCameraTop = MAP_SIZE;
    light.shadowCameraBottom = -MAP_SIZE;
    light.shadowCameraLeft = -MAP_SIZE;
    light.shadowCameraRight = MAP_SIZE;
    // light.shadowCameraVisible = true;
    light.shadowMapWidth = light.shadowMapHeight = 2048;

    this.scene.add(light);
    light.target.updateMatrixWorld();

    var plane = new THREE.PlaneBufferGeometry(MAP_SIZE, MAP_SIZE);
    var material = new THREE.MeshLambertMaterial();
    var floor = new THREE.Mesh(plane, material);
    floor.receiveShadow = true;
    floor.position.set(MAP_SIZE / 2, MAP_SIZE / 2, 0);
    this.scene.add(floor);
    this.balls = {};

    this.renderMap(Date.now());
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.rafId);
    RENDERER.domElement.remove();
  }

  renderMap() {
    this.rafId = requestAnimationFrame(::this.renderMap);
    this.updateCamera();
    RENDERER.render(this.scene, CAMERA);
  }

  updateCamera() {
    var user = this.state.user;
    if (!user) return;
    user = _.find(this.props.game.objects, {type: 'user', id: user.id});
    if (!user) return;
    CAMERA.position.x = user.mesh.position.x;
    CAMERA.position.y = user.mesh.position.y;
    CAMERA.position.z = 25;
  }

  render() {
    return <div />;
  }
}
