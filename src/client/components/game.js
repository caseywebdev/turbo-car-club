import _ from 'underscore';
import ArenaLight from '../lights/arena';
import BallMesh from '../meshes/ball';
import CAMERA from '../cameras/main';
import ChassisMesh from '../meshes/chassis';
import config from '../config';
import FloorMesh from '../meshes/floor';
import db from '../utils/db';
import Live from 'live';
import Peer from 'shared/peer';
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import RENDERER from '../renderers/main';
import THREE from 'three';
import WheelMesh from '../meshes/wheel';
import WorldLight from '../lights/world';

const KEYS = {};

document.addEventListener('keydown', ({key, which}) =>
  KEYS[key || which] = true
);
document.addEventListener('keyup', ({key, which}) =>
  KEYS[key || which] = false
);

export default class extends Component {
  constructor(props) {
    super(props);
    this.cars = {};
    this.peers = {};
    this.scene = new THREE.Scene();
    this.scene.add(WorldLight());
    this.scene.add(ArenaLight());
    this.scene.add(FloorMesh());
    this.ball = BallMesh();
    this.scene.add(this.ball);
    this.car = this.getCar('self');

    (window.live = this.live = new Live(config.signal))
      .on('host', ::this.setHost)
      .on('signal', ({data}) => this.host.signal(data))
      .on('auth', auth => db.set('auth', auth))
      .on('open', () => {
        const auth = db.get('auth');
        if (!auth) return;
        this.live.send('auth', auth, er => {
          if (er) return console.error(er);
          console.log('authorized!');
        });
      });
    if (props.verify) {
      this.live.send('verify', props.verify, (er, auth) => {
        if (er) return console.error(er);
        db.set('auth', auth);
        console.log('verify authorized!');
      });
    }
  }

  setHost(id) {
    if (this.host) this.host.off('close').close();
    this.host = new Peer()
      .on('signal', data => this.live.send('signal', {id, data}))
      .on('u', ::this.handleMessage)
      .on('close', () => this.setHost(id))
      .call();
  }

  getCar(id) {
    let car = this.cars[id];
    if (car) return car;
    const chassis = ChassisMesh();
    this.scene.add(chassis);
    return this.cars[id] = {
      id,
      chassis,
      wheels: _.times(4, () => {
        const mesh = WheelMesh();
        this.scene.add(mesh);
        return mesh;
      }),
      gas: 0,
      steering: 0,
      ballCam: true
    };
  }

  // handleUpdate(id, [px, py, pz, rx, ry, rz, rw, lx, ly, lz, ax, ay, az, g, s, hb]) {
  //   const car = this.getCar(id);
  //   car.chassis.body.setWorldTransform(
  //     new Ammo.btTransform(
  //       new Ammo.btQuaternion(rx, ry, rz, rw),
  //       new Ammo.btVector3(px, py, pz)
  //     )
  //   );
  //   car.chassis.body.setLinearVelocity(new Ammo.btVector3(lx, ly, lz));
  //   car.chassis.body.setAngularVelocity(new Ammo.btVector3(ax, ay, az));
  //   car.gas = g;
  //   car.steering = s;
  //   car.handbrake = hb;
  // }
  //
  // handleBallUpdate([px, py, pz, rx, ry, rz, rw, lx, ly, lz, ax, ay, az]) {
  //   const ball = this.ball;
  //   ball.body.setWorldTransform(
  //     new Ammo.btTransform(
  //       new Ammo.btQuaternion(rx, ry, rz, rw),
  //       new Ammo.btVector3(px, py, pz)
  //     )
  //   );
  //   ball.body.setLinearVelocity(new Ammo.btVector3(lx, ly, lz));
  //   ball.body.setAngularVelocity(new Ammo.btVector3(ax, ay, az));
  // }

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

    if (KEYS[37]) this.car.steering = -1;
    else if (KEYS[39]) this.car.steering = 1;
    else if (pad) {
      const [steering] = pad.axes;
      this.car.steering = Math.abs(steering) < 0.2 ? 0 : steering;
    } else this.car.steering = 0;

    if (KEYS[16]) this.car.handbrake = true;
    else if (pad) this.car.handbrake = pad.buttons[2].pressed;
    else this.car.handbrake = false;

    if (KEYS[66]) this.car.boost = true;
    else if (pad) this.car.boost = pad.buttons[1].pressed;
    else this.car.boost = false;

    if (KEYS[32]) this.car.jump = true;
    else if (pad) this.car.jump = pad.buttons[0].pressed;
    else this.car.jump = false;

    if (KEYS[89] && !this.prevPressed) this.car.ballCam = !this.car.ballCam;
    else if (pad && pad.buttons[3].pressed && !this.prevPressed) {
      this.car.ballCam = !this.car.ballCam;
    }
    this.prevPressed = KEYS[89] || (pad && pad.buttons[3].pressed);

    this.updateCamera();
    RENDERER.render(this.scene, CAMERA);
  }

  handleMessage({name, data}) {
    switch (name) {
    case 'frame':
      const {ball, cars} = data;
      this.ball.position.set(ball[0], ball[1], ball[2]);
      this.ball.quaternion.set(ball[3], ball[4], ball[5], ball[6]);
      _.each(cars, (v, id) => {
        const car = this.cars[id];
        car.chassis.position.set(v[0], v[1], v[2]);
        car.chassis.quaternion.set(v[3], v[4], v[5], v[6]);
        _.each(car.wheels, (wheel, i) => {
          i *= 7;
          wheel.position.set(v[7 + i], v[8 + i], v[9 + i]);
          wheel.quaternion.set(v[10 + i], v[11 + i], v[12 + i], v[13 + i]);
        });
      });
    }
  }

  updateCamera() {
    const cp = this.car.chassis.position;
    if (this.car.ballCam) {
      const bp = this.ball.position;
      const back = bp.clone().setY(0).sub(cp.clone().setY(0)).setLength(5);
      CAMERA.position.x = cp.x - back.x;
      CAMERA.position.y = cp.y + 1;
      CAMERA.position.z = cp.z - back.z;
      CAMERA.lookAt(bp);
    } else {
      const q = this.car.chassis.quaternion;
      const r = new THREE.Euler().setFromQuaternion(q, 'YXZ');
      CAMERA.position.x = cp.x - Math.sin(r.y) * 5;
      CAMERA.position.y = cp.y + 2;
      CAMERA.position.z = cp.z - Math.cos(r.y) * 5;
      CAMERA.lookAt(cp.clone().add(new THREE.Vector3(0, 1, 0)));
    }
  }

  render() {
    return <div />;
  }
}
