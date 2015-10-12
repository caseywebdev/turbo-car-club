import _ from 'underscore';
import Ammo from 'ammo';
import ChassisBody from 'shared/bodies/chassis';
import config from 'shared/config';

const {
  chassis: {width, height, depth},
  wheel: {radius},
  connectionPointOffset: [cp0, cp1, cp2]
} = config.car;

const WHEEL_CONNECTION_POINTS = _.map([
  [width / 2 + cp0, -height / 2 - cp1, depth / 2 + cp2],
  [-width / 2 - cp0, -height / 2 - cp1, depth / 2 + cp2],
  [-width / 2 - cp0, -height / 2 - cp1, -depth / 2 - cp2],
  [width / 2 + cp0, -height / 2 - cp1, -depth / 2 - cp2]
], ([x, y, z]) => new Ammo.btVector3(x, y, z));

const WHEEL_DIRECTION = new Ammo.btVector3(0, -1, 0);
const WHEEL_AXLE = new Ammo.btVector3(-1, 0, 0);
const SUSPENSION_REST_LENGTH = config.car.suspensionRestLength;
const TUNING = new Ammo.btVehicleTuning();

export default (world) => {
  const chassis = ChassisBody();
  world.addRigidBody(chassis);
  const raycaster = new Ammo.btDefaultVehicleRaycaster(world);
  const vehicle = new Ammo.btRaycastVehicle(TUNING, chassis, raycaster);
  vehicle.setCoordinateSystem(0, 1, 2);
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
    wheel.set_m_wheelsDampingCompression(config.car.wheelsDampingCompression);
    wheel.set_m_wheelsDampingRelaxation(config.car.wheelsDampingRelaxation);
    wheel.set_m_rollInfluence(config.car.rollInfluence);
    wheel.set_m_suspensionStiffness(config.car.suspensionStiffness);
    wheel.set_m_frictionSlip(config.car.frictionSlip);
  });
  world.addAction(vehicle);
  return {vehicle, chassis};
};
