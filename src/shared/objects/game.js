import _ from 'underscore';
import * as MainWorld from '../worlds/main';
import Ammo from 'ammo.js';
import BallBody from '../bodies/ball';
import CarBody from '../bodies/car';
import config from '../config';
import createBody from '../utils/create-body';
import FloorBody from '../bodies/floor';
import now from '../utils/now';

const WALLS = [
  [48, 1, 4],
  [51, 1, 2],
  [54, 1, 1],
  [57, 1, 1 / 2],
  [60, 1, 1 / 4],
  [64, 1, 0]
];

const FIXED_TIME_STEP = config.fixedTimeStep;
const MAX_SUB_STEPS = config.maxSubSteps;

export default class {
  constructor() {
    this.world = MainWorld.create();
    this.world.addRigidBody(FloorBody());
    this.ball = BallBody();
    this.ball.getWorldTransform().getOrigin().setX(-10);
    this.ball.getWorldTransform().getOrigin().setY(10);
    this.ball.getWorldTransform().getOrigin().setZ(-10);
    this.ball.getAngularVelocity().setX(10);
    this.ball.getAngularVelocity().setZ(-10);
    this.world.addRigidBody(this.ball);
    this.cars = {};

    _.each(WALLS, ([d, x, y]) => {
      let body;
      this.world.addRigidBody(body = createBody({
        shape: new Ammo.btStaticPlaneShape(new Ammo.btVector3(x, y, 0), 0)
      }));
      body.getWorldTransform().getOrigin().setX(-d);
      this.world.addRigidBody(body = createBody({
        shape: new Ammo.btStaticPlaneShape(new Ammo.btVector3(-x, y, 0), 0)
      }));
      body.getWorldTransform().getOrigin().setX(d);
      this.world.addRigidBody(body = createBody({
        shape: new Ammo.btStaticPlaneShape(new Ammo.btVector3(0, y, x), 0)
      }));
      body.getWorldTransform().getOrigin().setZ(-d);
      this.world.addRigidBody(body = createBody({
        shape: new Ammo.btStaticPlaneShape(new Ammo.btVector3(0, y, -x), 0)
      }));
      body.getWorldTransform().getOrigin().setZ(d);
    });
    this.start();
  }

  start() {
    this.time = 0;
    this.lastStep = now();
    this.step();
  }

  step() {
    this.tickTimeoutId = _.defer(::this.step);
    const step = now();
    const dt = step - this.lastStep;
    if (dt < FIXED_TIME_STEP) return;

    _.each(this.cars, car => {
      car.vehicle.setSteeringValue(-car.steering * config.car.steering, 0);
      car.vehicle.setSteeringValue(-car.steering * config.car.steering, 1);
      let grounded = 0;
      _.times(car.vehicle.getNumWheels(), i => {
        const info = car.vehicle.getWheelInfo(i);
        if (i < 2) {
          car.vehicle.setBrake(car.vehicle.handbrake ? 10 : 0, i);
          info.set_m_frictionSlip(
            car.handbrake ?
            config.car.handbrakeFrontFrictionSlip :
            config.car.frictionSlip
          );
        } else {
          car.vehicle.setBrake(car.vehicle.handbrake ? 10 : 0, i);
          info.set_m_frictionSlip(
            car.handbrake ?
            config.car.handbrakeRearFrictionSlip :
            config.car.frictionSlip
          );
        }
        if (info.get_m_raycastInfo().get_m_isInContact()) ++grounded;
      });

      const b = car.vehicle.getRigidBody().getWorldTransform().getBasis();
      const f = new Ammo.btVector3(
        0,
        -grounded * config.car.sticky,
        car.boost ?
        config.car.boostAcceleration :
        grounded * car.gas * config.car.acceleration
      );
      car.vehicle.getRigidBody().applyCentralForce(
        new Ammo.btVector3(
          b.getRow(0).dot(f),
          b.getRow(1).dot(f),
          b.getRow(2).dot(f)
        )
      );

      if (grounded && car.jumpState >= 2) car.jumpState = 0;

      if (grounded === 4 && !car.jumpState && car.jump) {
        const f = new Ammo.btVector3(0, config.car.jump, 0);
        car.vehicle.getRigidBody().applyCentralImpulse(
          new Ammo.btVector3(
            b.getRow(0).dot(f),
            b.getRow(1).dot(f),
            b.getRow(2).dot(f)
          )
        );
        car.jumpState = 1;
      }

      if (!grounded && car.jumpState === 1) car.jumpState = 2;

      if (car.jumpState === 2 && !car.jump) car.jumpState = 3;

      if (grounded === 0 && car.jumpState === 3 && car.jump) {
        const f = new Ammo.btVector3(0, config.car.jump, 0);
        car.vehicle.getRigidBody().applyCentralImpulse(
          new Ammo.btVector3(
            b.getRow(0).dot(f),
            b.getRow(1).dot(f),
            b.getRow(2).dot(f)
          )
        );
        car.jumpState = 4;
      }
    });
    this.time += dt;
    this.world.stepSimulation(dt, MAX_SUB_STEPS, FIXED_TIME_STEP);
    this.lastStep = step;
    // let foo = new Ammo.btTransform();
    // this.ball.getMotionState().getWorldTransform(foo);
  }

  handleMessage({name, data, data: {id}}) {
    switch (name) {
    case 'add-car':
      this.cars[id] = {vehicle: CarBody(this.world)};
      this.cars[id].gas = 0;
      this.cars[id].steering = 0;
      this.cars[id].boost = false;
      this.cars[id].handbrake = false;
      this.cars[id].jump = false;
      return;
    case 'update-car':
      this.cars[id].gas = data.gas;
      this.cars[id].steering = data.steering;
      this.cars[id].boost = data.boost;
      this.cars[id].handbrake = data.handbrake;
      this.cars[id].jump = data.jump;
      return;
    case 'remove-car':
      this.world.removeRigidBody(this.cars[id].vehicle.getRigidBody());
      this.world.removeAction(this.cars[id].vehicle);
      delete this.cars[id];
      return;
    }
  }
}
