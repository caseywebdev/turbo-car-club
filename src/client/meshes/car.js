import config from 'shared/config';
import THREE from 'three';

const {width, height, depth} = config.car.size;

const GEOMETRY = new THREE.SphereGeometry(width, height, depth);

const TEXTURE_URL = '/textures/checker.jpg';
const DIFFUSE_TEXTURE = THREE.ImageUtils.loadTexture(TEXTURE_URL);
DIFFUSE_TEXTURE.wrapS = THREE.RepeatWrapping;
DIFFUSE_TEXTURE.repeat.set(2, 1);
DIFFUSE_TEXTURE.magFilter = THREE.NearestFilter;

const MATERIAL = new THREE.MeshLambertMaterial({map: DIFFUSE_TEXTURE});

export const create = () => {
  const mesh = new THREE.Mesh(GEOMETRY, MATERIAL);
  mesh.position.z = height / 2;
  mesh.castShadow = true;
  return mesh;
};
