import _ from 'underscore';
import ArenaLight from 'client/lights/arena';
import BallMesh from 'client/meshes/ball';
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

import Ammo from 'ammo';

const collisionConfig = new Ammo.btDefaultCollisionConfiguration();
const dispatcher = new Ammo.btCollisionDispatcher(collisionConfig);
const broadphase = new Ammo.btDbvtBroadphase();
const solver = new Ammo.btSequentialImpulseConstraintSolver();
const world = new Ammo.btDiscreteDynamicsWorld(
  dispatcher,
  broadphase,
  solver,
  collisionConfig
);
world.setGravity(new Ammo.btVector3(0, -9.8, 0));
const floorShape = new Ammo.btStaticPlaneShape(new Ammo.btVector3(0, 1, 0), 0);
let rbci = new Ammo.btRigidBodyConstructionInfo(0, null, floorShape);
rbci.set_m_friction(1);
rbci.set_m_rollingFriction(1);
rbci.set_m_restitution(1);
world.addRigidBody(new Ammo.btRigidBody(rbci));

const sphereShape = new Ammo.btSphereShape(4);
const localInertia = new Ammo.btVector3();
sphereShape.calculateLocalInertia(1, localInertia);
rbci = new Ammo.btRigidBodyConstructionInfo(1, null, sphereShape, localInertia);
window.rbci = rbci;
rbci.set_m_friction(1);
rbci.set_m_restitution(1);
rbci.set_m_rollingFriction(1);
rbci.set_m_angularDamping(0.1);
const ballBody = new Ammo.btRigidBody(rbci);
ballBody.getWorldTransform().getOrigin().setY(10);
ballBody.getAngularVelocity().setX(10);
ballBody.getAngularVelocity().setZ(5);
window.ball = ballBody;
world.addRigidBody(ballBody);

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
    let car = this.cars[id];
    if (car) return car;
    const mesh = CarMesh();
    this.scene.add(mesh);
    const chassisShape = new Ammo.btBoxShape(new Ammo.btVector3(2, 1, 4));
    // const localInertia = new Ammo.btVector3();
    // shape.calculateLocalInertia(10, localInertia);
    const rbci = new Ammo.btRigidBodyConstructionInfo(0, null, shape);
    const body = new Ammo.btRigidBody(rbci);
    world.addRigidBody(body);
    return this.cars[id] = {body, mesh, gas: 0, wheel: 0};
  }

  handleUpdate(id, [px, pz, ry, g, w]) {
    const car = this.getCar(id);
    car.mesh.position.x = px;
    car.mesh.position.z = pz;
    car.mesh.rotation.y = ry;
    car.gas = g;
    car.wheel = w;
  }

  componentDidMount() {
    const el = ReactDOM.findDOMNode(this);
    this.scene = new THREE.Scene();

    RENDERER.domElement.style.display = 'block';
    el.appendChild(RENDERER.domElement);

    this.scene.add(WorldLight());
    this.scene.add(ArenaLight());
    this.scene.add(FloorMesh());
    this.scene.add(this.ball = BallMesh());
    this.car = this.getCar('self');
    this.car.mesh.position.z = 10;
    this.renderMap();
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.rafId);
    RENDERER.domElement.remove();
  }

  renderMap() {
    this.rafId = requestAnimationFrame(::this.renderMap);
    const pad = navigator.getGamepads()[0];
    if (KEYS[38]) this.car.gas = 1;
    else if (KEYS[40]) this.car.gas = -1;
    else if (pad) {
      const {6: reverse, 7: forward} = pad.buttons;
      this.car.gas = forward.value - reverse.value;
    } else this.car.gas = 0;

    if (KEYS[37]) this.car.wheel = -1;
    else if (KEYS[39]) this.car.wheel = 1;
    else if (pad) {
      const [wheel] = pad.axes;
      this.car.wheel = Math.abs(wheel) < 0.2 ? 0 : wheel;
    } else this.car.wheel = 0;

    world.stepSimulation(1 / 60, 1, 1 / 60);

    _.each(this.cars, car => {
      // car.speed = (car.speed + (car.gas * 0.1)) * 0.9;
      // const {speed, wheel} = car;
      // car.rotation.y -= speed * wheel * Math.PI * 0.02;
      // car.position.x -= speed * Math.sin(car.rotation.y);
      // car.position.z -= speed * Math.cos(car.rotation.y);
      // car.body.getWorldTransform().getOrigin().setX(car.position.x);
      // car.body.getWorldTransform().getOrigin().setY(car.position.y);
      // car.body.getWorldTransform().getOrigin().setZ(car.position.z);
      // const quat = new Ammo.btQuaternion();
      // quat.setEuler(car.rotation.x, car.rotation.y, car.rotation.z);
      // car.body.getWorldTransform().setRotation(quat);
      const p = car.body.getWorldTransform().getOrigin();
      car.mesh.position.set(p.x(), p.y(), p.z());
      const r = car.body.getWorldTransform().getRotation();
      car.mesh.rotation.setFromQuaternion(
        new THREE.Quaternion(r.x(), r.y(), r.z(), r.w())
      );
    });

    _.each(this.peers, peer =>
      peer.send('u', [
        this.car.mesh.position.x,
        this.car.mesh.position.z,
        this.car.mesh.rotation.y,
        this.car.gas,
        this.car.wheel
      ])
    );

    const origin = ballBody.getWorldTransform().getOrigin();
    this.ball.position.set(origin.x(), origin.y(), origin.z());
    const r = ballBody.getWorldTransform().getRotation();
    this.ball.rotation.setFromQuaternion(
      new THREE.Quaternion(r.x(), r.y(), r.z(), r.w())
    );

    this.updateCamera();
    RENDERER.render(this.scene, CAMERA);
  }

  updateCamera() {
    const {ball: {position: bp}, car: {mesh: {position: cp}}} = this;
    const back = bp.clone().setY(0).sub(cp.clone().setY(0)).setLength(15);
    CAMERA.position.x = cp.x - back.x;
    CAMERA.position.y = cp.y + 2;
    CAMERA.position.z = cp.z - back.z;
    CAMERA.lookAt(bp);
  }

  render() {
    return <div />;
  }
}
