import _ from 'underscore';
import Ammo from 'ammo';
import createBody from 'shared/utils/create-body';
import config from 'shared/config';

const {width, height, depth, wheel: {radius}} = config.car;

const CHASSIS_SHAPE =
  new Ammo.btBoxShape(new Ammo.btVector3(width / 2, height / 2, depth / 2));

const WHEEL_CONNECTION_POINTS = _.map([
  [width / 2, 1.3, depth / 2],
  [-width / 2, 1.3, depth / 2],
  [-width / 2, 1.3, -depth / 2],
  [width / 2, 1.3, -depth / 2]
], ([x, y, z]) => new Ammo.btVector3(x, y, z));

const WHEEL_DIRECTION = new Ammo.btVector3(0, -1, 0);
const WHEEL_AXLE = new Ammo.btVector3(-1, 0, 0);
const SUSPENSION_REST_LENGTH = 0.6;
const TUNING = new Ammo.btVehicleTuning();

export default (world) => {
  const localTrans = new Ammo.btTransform();
  localTrans.setIdentity();
  localTrans.setOrigin(new Ammo.btVector3(0, 1.3, 0));
  const shape = new Ammo.btCompoundShape();
  shape.addChildShape(localTrans, CHASSIS_SHAPE);
  const startTrans = new Ammo.btTransform();
  startTrans.setIdentity();
  startTrans.setOrigin(new Ammo.btVector3(0, 0, 0));
  const chassis = createBody({shape, startTrans, ...config.car});
  world.addRigidBody(chassis);

  const raycaster = new Ammo.btDefaultVehicleRaycaster(world);
  const vehicle =
    new Ammo.btRaycastVehicle(TUNING, chassis, raycaster);
  _.each(WHEEL_CONNECTION_POINTS, (point, i) => {
    vehicle.addWheel(
      point,
      WHEEL_DIRECTION,
      WHEEL_AXLE,
      SUSPENSION_REST_LENGTH,
      radius,
      TUNING,
      i < 2
    );
    const wheel = vehicle.getWheelInfo(i);
    wheel.set_m_wheelsDampingRelaxation(2.3);
    wheel.set_m_wheelsDampingCompression(4.4);
    wheel.set_m_rollInfluence(0.1);
    wheel.set_m_suspensionStiffness(20);
    wheel.set_m_frictionSlip(1000);
  });
  world.addAction(vehicle);
  return vehicle;
};
