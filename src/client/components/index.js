import _ from 'underscore';
import CAMERA from 'client/camera';
import ArenaLight from 'client/lights/arena';
import BallBody from 'shared/bodies/ball';
import BallMesh from 'client/meshes/ball';
import CarBody from 'shared/bodies/car';
import CarMesh from 'client/meshes/car';
import FloorBody from 'shared/bodies/floor';
import FloorMesh from 'client/meshes/floor';
import Live from 'live';
import Peer from 'shared/peer';
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import RENDERER from 'client/renderer';
import THREE from 'three';
import WheelMesh from 'client/meshes/wheel';
import WorldLight from 'client/lights/world';
import WorldObject from 'shared/objects/world';

const KEYS = {};

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
    this.world = WorldObject();
    this.world.addRigidBody(FloorBody());
    this.ball = {body: BallBody(), mesh: BallMesh()};
    this.ball.body.getWorldTransform().getOrigin().setX(20);
    this.ball.body.getWorldTransform().getOrigin().setY(4);
    this.ball.body.getWorldTransform().getOrigin().setY(-20);
    this.world.addRigidBody(this.ball.body);
    this.scene = new THREE.Scene();
    this.scene.add(WorldLight());
    this.scene.add(ArenaLight());
    this.scene.add(FloorMesh());
    this.scene.add(this.ball.mesh);
    this.car = this.getCar('self');
    this.car.body.getRigidBody().getWorldTransform().getOrigin().setX(0);
    this.car.body.getRigidBody().getWorldTransform().getOrigin().setY(10);
    this.car.body.getRigidBody().getWorldTransform().getOrigin().setZ(0);

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
    const body = CarBody(this.world);
    const wheels = _.times(body.getNumWheels(), i => {
      const mesh = WheelMesh();
      this.scene.add(mesh);
      window.wheel = body.getWheelInfo(i);
      return {body: body.getWheelInfo(i), mesh};
    });
    return this.cars[id] = {body, mesh, wheels, gas: 0, wheel: 0};
  }

  handleUpdate(id, [px, py, pz, rx, ry, rz, rw, g, w]) {
    const car = this.getCar(id);
    car.body.getRigidBody().getWorldTransform().getOrigin().setX(px);
    car.body.getRigidBody().getWorldTransform().getOrigin().setY(py);
    car.body.getRigidBody().getWorldTransform().getOrigin().setZ(pz);
    car.body.getRigidBody().getWorldTransform().getRotation().setX(rx);
    car.body.getRigidBody().getWorldTransform().getRotation().setY(ry);
    car.body.getRigidBody().getWorldTransform().getRotation().setZ(rz);
    car.body.getRigidBody().getWorldTransform().getRotation().setW(rw);
    car.gas = g;
    car.wheel = w;
  }

  componentDidMount() {
    ReactDOM.findDOMNode(this).appendChild(RENDERER.domElement);
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

    this.world.stepSimulation(1 / 60, 1, 1 / 60);

    _.each(this.cars, car => {
      car.body.applyEngineForce(car.gas * 1000, 2);
      car.body.applyEngineForce(car.gas * 1000, 3);
      // car.body.setBrake(1, 2);
      // car.body.setBrake(1, 3);
      car.body.setSteeringValue(-car.wheel * 0.3, 0);
      car.body.setSteeringValue(-car.wheel * 0.3, 1);
      car.body.setSteeringValue(car.wheel * 0.3, 2);
      car.body.setSteeringValue(car.wheel * 0.3, 3);
      const p = car.body.getRigidBody().getWorldTransform().getOrigin();
      car.mesh.position.set(p.x(), p.y(), p.z());
      const r = car.body.getRigidBody().getWorldTransform().getRotation();
      car.mesh.rotation.setFromQuaternion(
        new THREE.Quaternion(r.x(), r.y(), r.z(), r.w())
      );
      _.each(car.wheels, (wheel, i) => {
        const transform = car.body.getWheelTransformWS(i);
        const p = transform.getOrigin();
        wheel.mesh.position.set(p.x(), p.y(), p.z());
        const r = transform.getRotation();
        wheel.mesh.rotation.setFromQuaternion(
          new THREE.Quaternion(r.x(), r.y(), r.z(), r.w())
        );
      });
    });

    _.each(this.peers, peer =>
      peer.send('u', [
        this.car.body.getRigidBody().getWorldTransform().getOrigin().x(),
        this.car.body.getRigidBody().getWorldTransform().getOrigin().y(),
        this.car.body.getRigidBody().getWorldTransform().getOrigin().z(),
        this.car.body.getRigidBody().getWorldTransform().getRotation().x(),
        this.car.body.getRigidBody().getWorldTransform().getRotation().y(),
        this.car.body.getRigidBody().getWorldTransform().getRotation().z(),
        this.car.body.getRigidBody().getWorldTransform().getRotation().w(),
        this.car.gas,
        this.car.wheel
      ])
    );

    const origin = this.ball.body.getWorldTransform().getOrigin();
    this.ball.mesh.position.set(origin.x(), origin.y(), origin.z());
    const r = this.ball.body.getWorldTransform().getRotation();
    this.ball.mesh.rotation.setFromQuaternion(
      new THREE.Quaternion(r.x(), r.y(), r.z(), r.w())
    );

    this.updateCamera();
    RENDERER.render(this.scene, CAMERA);
  }

  updateCamera() {
    const {ball: {mesh: {position: bp}}, car: {mesh: {position: cp}}} = this;
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
