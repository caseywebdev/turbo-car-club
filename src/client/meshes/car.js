import config from 'shared/config';
import THREE from 'three';

const {width, height, depth} = config.car.size;

const GEOMETRY = new THREE.BoxGeometry(width, height, depth);

const TEXTURE_URL = '/textures/checker.jpg';
const DIFFUSE_TEXTURE = THREE.ImageUtils.loadTexture(TEXTURE_URL);
DIFFUSE_TEXTURE.wrapS = THREE.RepeatWrapping;
DIFFUSE_TEXTURE.wrapT = THREE.RepeatWrapping;
DIFFUSE_TEXTURE.repeat.set(1, 1);
DIFFUSE_TEXTURE.magFilter = THREE.NearestFilter;

const MATERIAL = new THREE.MeshLambertMaterial({map: DIFFUSE_TEXTURE});

export default () => {
  const mesh = new THREE.Mesh(GEOMETRY, MATERIAL);
  mesh.position.y = height / 2;
  mesh.castShadow = true;
  return mesh;
};
