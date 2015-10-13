import _ from 'underscore';
import Ammo from 'ammo';
import CarBody from 'shared/bodies/car';
import createBody from 'shared/utils/create-body';
import config from 'shared/config';
import WorldObject from 'shared/objects/world';
import FloorBody from 'shared/bodies/floor';
import BallBody from 'shared/bodies/ball';

const WALLS = [
  [48, 1, 4],
  [51, 1, 2],
  [54, 1, 1],
  [57, 1, 1 / 2],
  [60, 1, 1 / 4],
  [64, 1, 0]
];

const STEP_TIME = 1 / config.sps;

const serializeBody = trans => {
  const o = trans.getOrigin();
  const r = trans.getRotation();
  return [o.x(), o.y(), o.z(), r.x(), r.y(), r.z(), r.w()];
};

export default class {
  constructor(send) {
    this.send = send;
    this.world = WorldObject();
    this.world.addRigidBody(FloorBody());
    this.ball = BallBody();
    this.ball.getWorldTransform().getOrigin().setX(-10);
    this.ball.getWorldTransform().getOrigin().setY(10);
    this.ball.getWorldTransform().getOrigin().setZ(-10);
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
    this.frame = 0;
    this.lastFrame = _.now() - (STEP_TIME * 1000);
    this.tick();
  }

  tick() {
    if (_.now() - this.lastFrame >= STEP_TIME * 1000) this.step();
    this.tickTimeoutId = _.defer(::this.tick);
  }

  step() {
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
    this.lastFrame = _.now();
    ++this.frame;
    this.world.stepSimulation(1 / config.sps, 0, 1 / config.sps);
    this.send({
      name: 'frame',
      data: {
        frame: this.frame,
        ball: serializeBody(this.ball.getWorldTransform()),
        cars: _.mapObject(this.cars, car =>
          serializeBody(car.vehicle.getRigidBody().getWorldTransform()).concat(
            ..._.times(car.vehicle.getNumWheels(), i =>
              serializeBody(car.vehicle.getWheelTransformWS(i))
            )
          )
        )
      }
    });
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
