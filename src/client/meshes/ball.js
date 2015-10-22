import config from 'shared/config';
import THREE from 'three';

const {radius} = config.ball;

const SUBDIVISIONS = 16;

const GEOMETRY = new THREE.SphereGeometry(radius, SUBDIVISIONS, SUBDIVISIONS);

const MATERIAL = new THREE.MeshLambertMaterial({color: 0x00ff00});

const TEXTURE_URL = 'textures/checker.jpg';
(new THREE.TextureLoader()).load(TEXTURE_URL, texture => {
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  texture.magFilter = THREE.NearestFilter;
  MATERIAL.map = texture;
  MATERIAL.needsUpdate = true;
});

export default () => {
  const mesh = new THREE.Mesh(GEOMETRY, MATERIAL);
  mesh.castShadow = true;
  return mesh;
};
