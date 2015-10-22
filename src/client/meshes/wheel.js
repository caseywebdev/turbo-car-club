import config from 'shared/config';
import THREE from 'three';

const {radius, width} = config.car.wheel;

const SEGMENTS = 16;

const GEOMETRY = new THREE.CylinderGeometry(radius, radius, width, SEGMENTS);

const MATERIAL = new THREE.MeshLambertMaterial({color: 0xff0000});

const TEXTURE_URL = 'textures/checker.jpg';
(new THREE.TextureLoader()).load(TEXTURE_URL, texture => {
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1, 0);
  texture.magFilter = THREE.NearestFilter;
  MATERIAL.map = texture;
  MATERIAL.needsUpdate = true;
});

export default () => {
  const mesh = new THREE.Mesh(GEOMETRY, MATERIAL);
  mesh.rotation.z = Math.PI / 2;
  mesh.castShadow = true;
  const obj = new THREE.Object3D();
  obj.add(mesh);
  return obj;
};
