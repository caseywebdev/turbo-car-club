import THREE from 'three';

const MAP_SIZE = 128;

const GEOMETRY = new THREE.PlaneBufferGeometry(MAP_SIZE, MAP_SIZE);

const MATERIAL = new THREE.MeshLambertMaterial();

const TEXTURE_URL = 'textures/checker.jpg';
(new THREE.TextureLoader()).load(TEXTURE_URL, texture => {
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(MAP_SIZE / 4, MAP_SIZE / 4);
  texture.magFilter = THREE.NearestFilter;
  MATERIAL.map = texture;
  MATERIAL.needsUpdate = true;
});

export default () => {
  const mesh = new THREE.Mesh(GEOMETRY, MATERIAL);
  mesh.receiveShadow = true;
  mesh.rotation.x = -Math.PI / 2;
  return mesh;
};
