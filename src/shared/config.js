export default {
  ball: {
    radius: 4,
    mass: 10,
    props: {
      friction: 1,
      restitution: 1,
      rollingFriction: 1,
      angularDamping: 0.1,
      linearDamping: 0.1
    }
  },
  chassis: {
    width: 4,
    height: 1.5,
    depth: 6,
    mass: 100,
    props: {
      friction: 1,
      rollingFriction: 1,
      angularDamping: 0.2,
      linearDamping: 0.3,
      restitution: 0.3
    }
  },
  wheel: {
    width: 1,
    radius: 0.6,
    mass: 10,
    props: {
      friction: 10,
      rollingFriction: 1,
      angularDamping: 0.5,
      linearDamping: 0.1
    }
  },
  floor: {
    props: {
      friction: 1,
      rollingFriction: 1,
      restitution: 1
    }
  }
};
