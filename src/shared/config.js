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
  car: {
    wheelsDampingCompression: 4,
    wheelsDampingRelaxation: 5,
    rollInfluence: 0,
    suspensionStiffness: 25,
    frictionSlip: 50,
    handbrakeFrontFrictionSlip: 1,
    handbrakeRearFrictionSlip: 0.5,
    chassis: {
      width: 4,
      height: 1.5,
      depth: 6,
      mass: 100,
      props: {
        friction: 0.5,
        rollingFriction: 0.5,
        angularDamping: 0.2,
        linearDamping: 0.3,
        restitution: 0.2
      }
    },
    wheel: {
      width: 1,
      radius: 0.6
    }
  },
  floor: {
    props: {
      friction: 1,
      rollingFriction: 1,
      restitution: 0.5
    }
  }
};
