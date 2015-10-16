import _ from 'underscore';
import Ammo from 'ammo.js';

const LOCAL_INERTIA = new Ammo.btVector3(0, 0, 0);
const MOTION_STATE = new Ammo.btDefaultMotionState();

export default (options) => {
  const {mass, props, shape} = options;
  if (mass) shape.calculateLocalInertia(mass, LOCAL_INERTIA);
  const rbci = new Ammo.btRigidBodyConstructionInfo(
    mass || 0,
    mass && MOTION_STATE,
    shape,
    LOCAL_INERTIA
  );
  _.each(props, (val, key) => rbci[`set_m_${key}`](val));
  const body = new Ammo.btRigidBody(rbci);
  body.setActivationState(4);
  return body;
};
