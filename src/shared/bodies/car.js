import _ from 'underscore';
import Ammo from 'ammo';
import ChassisBody from 'shared/bodies/chassis';
import config from 'shared/config';

const {chassis: {width, height, depth}, wheel: {radius, width: wheelWidth}} =
  config;

const WHEEL_CONNECTION_POINTS = _.map([
  [(width - wheelWidth) / 1.7, -height / 2 + radius * 1.6, depth / 2.1 - radius],
  [-(width - wheelWidth) / 1.7, -height / 2 + radius * 1.6, depth / 2.1 - radius],
  [-(width - wheelWidth) / 1.7, -height / 2 + radius * 1.6, -depth / 2.1 + radius],
  [(width - wheelWidth) / 1.7, -height / 2 + radius * 1.6, -depth / 2.1 + radius]
], ([x, y, z]) => new Ammo.btVector3(x, y, z));

const WHEEL_DIRECTION = new Ammo.btVector3(0, -1, 0);
const WHEEL_AXLE = new Ammo.btVector3(-1, 0, 0);
const SUSPENSION_REST_LENGTH = radius;
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
    wheel.set_m_wheelsDampingCompression(4);
    wheel.set_m_wheelsDampingRelaxation(5);
    wheel.set_m_rollInfluence(0);
    wheel.set_m_suspensionStiffness(50);
    wheel.set_m_frictionSlip(1000);
  });
  world.addAction(vehicle);
  return {vehicle, chassis};
};
