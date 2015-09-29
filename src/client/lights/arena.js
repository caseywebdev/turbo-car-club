import THREE from 'three';

const COLOR = 0xffffff;
const INTENSITY = 0.9;
const ARENA_SIZE = 128;
const SHADOW_MAP_SIZE = 4096;

export default () => {
  const light = new THREE.DirectionalLight(COLOR, INTENSITY);
  light.position.set(-ARENA_SIZE / 4, ARENA_SIZE / 2, -ARENA_SIZE / 4);
  light.castShadow = true;
  light.shadowCameraNear = 0;
  light.shadowCameraFar = ARENA_SIZE;
  light.shadowCameraTop = ARENA_SIZE;
  light.shadowCameraBottom = -ARENA_SIZE;
  light.shadowCameraLeft = -ARENA_SIZE;
  light.shadowCameraRight = ARENA_SIZE;
  // light.shadowCameraVisible = true;
  light.shadowMapWidth = light.shadowMapHeight = SHADOW_MAP_SIZE;
  return light;
};
