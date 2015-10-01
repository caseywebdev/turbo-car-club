import _ from 'underscore';
import Ammo from 'ammo';

const LOCAL_INERTIA = new Ammo.btVector3();

export default (options) => {
  const {mass, shape, props} = options;
  if (mass) shape.calculateLocalInertia(mass, LOCAL_INERTIA);
  const rbci =
    new Ammo.btRigidBodyConstructionInfo(mass || 0, null, shape, LOCAL_INERTIA);
  _.each(props, (val, key) => rbci[`set_m_${key}`](val));
  return new Ammo.btRigidBody(rbci);
};