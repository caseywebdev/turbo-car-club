export default {
  sps: 60,
  ball: {
    radius: 1,
    mass: 1,
    props: {
      friction: 0.8,
      restitution: 0.8,
      rollingFriction: 0.8,
      angularDamping: 0.1,
      linearDamping: 0.1
    }
  },
  car: {
    wheelsDampingCompression: 7,
    wheelsDampingRelaxation: 6,
    rollInfluence: 0,
    suspensionStiffness: 50,
    frictionSlip: 10,
    handbrakeFrontFrictionSlip: 1,
    handbrakeRearFrictionSlip: 0.5,
    suspensionRestLength: 0.2,
    connectionPointOffset: [-0.1, -0.15, -0.2],
    acceleration: 200,
    boostAcceleration: 2000,
    jump: 500,
    sticky: 200,
    steering: Math.PI * 0.1,
    chassis: {
      width: 1.2,
      height: 0.4,
      depth: 1.8,
      mass: 100,
      props: {
        friction: 0.5,
        rollingFriction: 0.5,
        angularDamping: 0.2,
        linearDamping: 0.2,
        restitution: 0.2
      }
    },
    wheel: {
      width: 0.2,
      radius: 0.2
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
