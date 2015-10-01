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
    width: 5,
    height: 1.4,
    depth: 10,
    mass: 100,
    props: {
      friction: 1
    },
    wheel: {
      width: 0.3,
      radius: 1
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
