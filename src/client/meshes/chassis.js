import config from 'shared/config';
import THREE from 'three';

const {width, height, depth} = config.chassis;

const BASE_GEO = new THREE.BoxGeometry(width, height - 0.25, depth);
const TOP_GEO = new THREE.BoxGeometry(width * 0.75, 0.25, 2);

const TEXTURE_URL = '/textures/checker.jpg';
const DIFFUSE_TEXTURE = THREE.ImageUtils.loadTexture(TEXTURE_URL);
DIFFUSE_TEXTURE.wrapS = THREE.RepeatWrapping;
DIFFUSE_TEXTURE.wrapT = THREE.RepeatWrapping;
DIFFUSE_TEXTURE.repeat.set(1, 1);
DIFFUSE_TEXTURE.magFilter = THREE.NearestFilter;

const MATERIAL = new THREE.MeshLambertMaterial({
  color: 0x0000ff,
  map: DIFFUSE_TEXTURE
});

export default () => {
  const obj = new THREE.Object3D();
  const base = new THREE.Mesh(BASE_GEO, MATERIAL);
  base.castShadow = true;
  base.position.y = -0.25 / 2;
  obj.add(base);

  const top = new THREE.Mesh(TOP_GEO, MATERIAL);
  top.castShadow = true;
  top.position.y = (height - 0.25) / 2;
  top.position.z = -0.75;
  obj.add(top);

  obj.position.y = height / 2;
  return obj;
};
