import Ammo from 'ammo.js';

const COLLISION_CONFIGURATION = new Ammo.btDefaultCollisionConfiguration();
const DISPATCHER = new Ammo.btCollisionDispatcher(COLLISION_CONFIGURATION);
const BROADPHASE_INTERFACE = new Ammo.btDbvtBroadphase();
const CONSTRAINT_SOLVER = new Ammo.btSequentialImpulseConstraintSolver();
const GRAVITY = new Ammo.btVector3(0, -9.8, 0);

export default () => {
  const world = new Ammo.btDiscreteDynamicsWorld(
    DISPATCHER,
    BROADPHASE_INTERFACE,
    CONSTRAINT_SOLVER,
    COLLISION_CONFIGURATION
  );
  world.setGravity(GRAVITY);
  return world;
};
