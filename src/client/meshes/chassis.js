import config from 'shared/config';
import THREE from 'three';

const {width, height, depth} = config.car.chassis;

const GEOMETRY = new THREE.BoxGeometry(width, height, depth);

const MATERIAL = new THREE.MeshLambertMaterial({color: 0x0000ff});

const TEXTURE_URL = 'textures/checker.jpg';
(new THREE.TextureLoader()).load(TEXTURE_URL, texture => {
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1, 1);
  texture.magFilter = THREE.NearestFilter;
  MATERIAL.map = texture;
  MATERIAL.needsUpdate = true;
});

export default () => {
  const mesh = new THREE.Mesh(GEOMETRY, MATERIAL);
  mesh.castShadow = true;
  return mesh;
};
