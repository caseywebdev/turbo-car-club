import config from 'shared/config';
import THREE from 'three';

const {radius, width} = config.car.wheel;

const SEGMENTS = 16;

const GEOMETRY = new THREE.CylinderGeometry(radius, radius, width, SEGMENTS);

const TEXTURE_URL = 'textures/checker.jpg';
const DIFFUSE_TEXTURE = THREE.ImageUtils.loadTexture(TEXTURE_URL);
DIFFUSE_TEXTURE.wrapS = THREE.RepeatWrapping;
DIFFUSE_TEXTURE.wrapT = THREE.RepeatWrapping;
DIFFUSE_TEXTURE.repeat.set(1, 0);
DIFFUSE_TEXTURE.magFilter = THREE.NearestFilter;

const MATERIAL = new THREE.MeshLambertMaterial({
  color: 0xff0000,
  map: DIFFUSE_TEXTURE
});

export default () => {
  const mesh = new THREE.Mesh(GEOMETRY, MATERIAL);
  mesh.rotation.z = Math.PI / 2;
  mesh.castShadow = true;
  const obj = new THREE.Object3D();
  obj.add(mesh);
  return obj;
};
