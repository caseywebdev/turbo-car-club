import THREE from 'three';

const SKY_COLOR = 0xffffff;
const GROUND_COLOR = 0x333333;
const INTENSITY = 0.5;

export default () =>
  new THREE.HemisphereLight(SKY_COLOR, GROUND_COLOR, INTENSITY);
