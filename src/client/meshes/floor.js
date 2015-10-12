import THREE from 'three';

const MAP_SIZE = 128;

const GEOMETRY = new THREE.PlaneBufferGeometry(MAP_SIZE, MAP_SIZE);

const TEXTURE_URL = '/textures/checker.jpg';
const DIFFUSE_TEXTURE = THREE.ImageUtils.loadTexture(TEXTURE_URL);
DIFFUSE_TEXTURE.wrapS = THREE.RepeatWrapping;
DIFFUSE_TEXTURE.wrapT = THREE.RepeatWrapping;
DIFFUSE_TEXTURE.repeat.set(MAP_SIZE / 4, MAP_SIZE / 4);
DIFFUSE_TEXTURE.magFilter = THREE.NearestFilter;

const MATERIAL = new THREE.MeshLambertMaterial({map: DIFFUSE_TEXTURE});

export default () => {
  const mesh = new THREE.Mesh(GEOMETRY, MATERIAL);
  mesh.receiveShadow = true;
  mesh.rotation.x = -Math.PI / 2;
  return mesh;
};
