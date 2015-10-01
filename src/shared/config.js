export default {
  ball: {
    radius: 4,
    mass: 1,
    props: {
      friction: 1,
      restitution: 1,
      rollingFriction: 1,
      angularDamping: 0.1,
      linearDamping: 0.1
    }
  },
  car: {
    width: 2,
    height: 1,
    depth: 4,
    mass: 100
  },
  floor: {
    props: {
      friction: 1,
      rollingFriction: 1,
      restitution: 1
    }
  }
};
