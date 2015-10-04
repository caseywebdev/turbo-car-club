import _ from 'underscore';
import Ammo from 'ammo';
import ChassisBody from 'shared/bodies/chassis';
import config from 'shared/config';
import WheelBody from 'shared/bodies/wheel';

const {chassis: {width, height, depth}, wheel: {radius, width: wheelWidth}} =
  config;

const WHEEL_CONNECTION_POINTS = _.map([
  [(width - wheelWidth) / 1.7, -height / 2 + radius - 0.4, depth / 2.1 - radius],
  [-(width - wheelWidth) / 1.7, -height / 2 + radius - 0.4, depth / 2.1 - radius],
  [-(width - wheelWidth) / 1.7, -height / 2 + radius - 0.4, -depth / 2.1 + radius],
  [(width - wheelWidth) / 1.7, -height / 2 + radius - 0.4, -depth / 2.1 + radius]
], ([x, y, z]) => new Ammo.btVector3(x, y, z));

export default (world) => {
  const chassis = ChassisBody();
  world.addRigidBody(chassis);
  const wheels = _.map(WHEEL_CONNECTION_POINTS, point => {
    const body = WheelBody();
    world.addRigidBody(body);
    const localA = new Ammo.btTransform();
    localA.setIdentity();
    localA.setOrigin(point);
    const localB = new Ammo.btTransform();
    localB.setIdentity();
    const constraint = new Ammo.btGeneric6DofSpring2Constraint(
      chassis,
      body,
      localA,
      localB,
      Ammo.RO_XYZ
    );
    constraint.enableSpring(1, true);
    constraint.setStiffness(1, 500);
    constraint.setDamping(1, 100);
    constraint.setLinearLowerLimit(new Ammo.btVector3(0, 0, 0));
    constraint.setLinearUpperLimit(new Ammo.btVector3(0, 0.2, 0));
    constraint.setAngularLowerLimit(new Ammo.btVector3(0, 0, 0));
    constraint.setAngularUpperLimit(new Ammo.btVector3(-1, 0, 0));
    world.addConstraint(constraint, true);
    return {body, constraint};
  });
  return {chassis, wheels};
};
