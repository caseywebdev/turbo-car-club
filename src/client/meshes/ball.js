import config from 'shared/config';
import THREE from 'three';

const {radius} = config.ball;

const SUBDIVISIONS = 16;

const GEOMETRY = new THREE.SphereGeometry(radius, SUBDIVISIONS, SUBDIVISIONS);

const TEXTURE_URL = 'textures/checker.jpg';
const DIFFUSE_TEXTURE = THREE.ImageUtils.loadTexture(TEXTURE_URL);
DIFFUSE_TEXTURE.wrapS = THREE.RepeatWrapping;
DIFFUSE_TEXTURE.wrapT = THREE.RepeatWrapping;
DIFFUSE_TEXTURE.repeat.set(4, 4);
DIFFUSE_TEXTURE.magFilter = THREE.NearestFilter;

const MATERIAL = new THREE.MeshLambertMaterial({
  color: 0x00ff00,
  map: DIFFUSE_TEXTURE
});

export default () => {
  const mesh = new THREE.Mesh(GEOMETRY, MATERIAL);
  mesh.castShadow = true;
  return mesh;
};
